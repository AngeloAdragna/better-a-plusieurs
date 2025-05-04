import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import {ref, onChildAdded, push, set, get, onDisconnect, onChildRemoved, update} from 'firebase/database';
import VideoSideBar from './VideoSideBar';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

const VideoCall = ({ roomId, userId, username }) => {

    const localStreamRef = useRef();
    const peerConnections = useRef({});

    const createPeerConnection = (remoteUserId) => {
        const pc = new RTCPeerConnection({ iceServers });

        if (localStreamRef.current && localStreamRef.current.srcObject) {
            localStreamRef.current.srcObject.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current.srcObject));
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidatesRef = ref(db, `rooms/${roomId}/signaling/iceCandidates`);
                push(candidatesRef, { candidate: event.candidate.toJSON(), from: userId });
            }
        };

        pc.ontrack = (event) => {
            console.log("✅ ontrack déclenché pour", remoteUserId);
            const remoteVideo = document.getElementById(`video-${remoteUserId}`);
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            }

            const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
            update(userRef, { status: "connected", pseudo: username });
        };

        peerConnections.current[remoteUserId] = pc;
        return pc;
    };

    const [localStream, setLocalStream] = useState(null);
    const [remoteUserIds, setRemoteUserIds] = useState([]);

    useEffect(() => {
        const startLocalStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current.srcObject = stream;
            stream.getTracks().forEach((track) => track.enabled = true);
        };

        startLocalStream();
    }, []);
    useEffect(() => {
        const usersRef = ref(db, `rooms/${roomId}/users`);
        const unsub = onChildAdded(usersRef, (snapshot) => {
            const uid = snapshot.key;
            if (uid !== userId) {
                setRemoteUserIds((prev) => [...new Set([...prev, uid])]);
            }
        });

        return () => unsub();
    }, [roomId, userId]);

    useEffect(() => {
        if (!localStream) return;

        const offersRef = ref(db, `rooms/${roomId}/signaling/offers`);
        const answersRef = ref(db, `rooms/${roomId}/signaling/answers`);
        const candidatesRef = ref(db, `rooms/${roomId}/signaling/iceCandidates`);

        // 1. On stocke les fonctions de désabonnement
        const unsubOffers = onChildAdded(offersRef, async (snapshot) => {
            const { offer, from } = snapshot.val();
            if (from === userId) return;

            let pc = peerConnections.current[from];
            if (!pc) {
                pc = createPeerConnection(from);
            }

            if (
                pc.signalingState === "stable" ||
                pc.signalingState === "have-remote-offer"
            ) {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await push(ref(db, `rooms/${roomId}/signaling/answers`), {
                    answer: pc.localDescription.toJSON(),
                    from: userId,
                });
            } else {
                console.warn("❗ Ignored setting offer because signalingState is", pc.signalingState);
            }
        });

        const unsubAnswers = onChildAdded(answersRef, async (snapshot) => {
            const { answer, from } = snapshot.val();
            const pc = peerConnections.current[from];
            if (pc) {
                if (pc.signalingState === "have-local-offer") {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                } else {
                    console.warn("❗ Ignored setting answer because signalingState is", pc.signalingState);
                }
            }
        });

        const unsubCandidates = onChildAdded(candidatesRef, async (snapshot) => {
            const { candidate, from } = snapshot.val();
            const pc = peerConnections.current[from];
            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        // Crée les offres vers les autres utilisateurs
        const createOffers = async () => {
            for (const remoteUserId of remoteUserIds.filter(id => id !== userId)) {
                // ✅ Vérifie si une connexion existe déjà
                if (peerConnections.current[remoteUserId]) {
                    console.log(`⏩ Connexion déjà existante avec ${remoteUserId}`);
                    continue;
                }

                const pc = createPeerConnection(remoteUserId);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await push(ref(db, `rooms/${roomId}/signaling/offers`), {
                    offer: pc.localDescription.toJSON(),
                    from: userId,
                    to: remoteUserId,
                });
                console.log(`📤 Offre envoyée à ${remoteUserId}`);
            }
        };

        createOffers();

        // 2. On arrête les écouteurs quand le composant se démonte
        return () => {
            unsubOffers();
            unsubAnswers();
            unsubCandidates();
        };
    }, [localStream, roomId, userId, remoteUserIds]);

    useEffect(() => {
        const usersRef = ref(db, `rooms/${roomId}/users`);

        const unsubscribe = onChildRemoved(usersRef, (snapshot) => {
            const userLeftId = snapshot.key;

            const pc = peerConnections.current[userLeftId];
            if (pc) {
                pc.close();
                delete peerConnections.current[userLeftId];
                console.log(`❌ Connexion fermée avec ${userLeftId}`);
            }

            const remoteVideo = document.getElementById(`video-${userLeftId}`);
            if (remoteVideo) {
                remoteVideo.srcObject = null;
            }
        });

        return () => unsubscribe();
    }, [roomId]);
    useEffect(() => {
        const handleUnload = () => {
            leaveRoom(roomId, userId); // ✅ utilise userId reçu en prop
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [roomId, userId]);
    return (
        <>
            <VideoSideBar roomId={roomId} localStreamRef={localStreamRef} localUserId={userId} />
        </>
    );
};

export default VideoCall;