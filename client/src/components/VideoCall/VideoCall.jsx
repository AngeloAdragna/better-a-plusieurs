import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import {
    ref,
    onChildAdded,
    onChildRemoved,
    push,
    set,
    get,
    onDisconnect,
    update
} from 'firebase/database';
import VideoSideBar from './VideoSideBar';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

const VideoCall = ({ roomId, userId, username }) => {
    const localStreamRef = useRef();
    const peerConnections = useRef({});
    const receivedAnswers = useRef(new Set());
    const [localStream, setLocalStream] = useState(null);
    const [remoteUserIds, setRemoteUserIds] = useState([]);
    const [remoteStreams, setRemoteStreams] = useState({});

    // Ajoute l'utilisateur à la room avec timestamp
    useEffect(() => {
        const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
        const timestamp = Date.now();

        set(userRef, {
            pseudo: username,
            status: 'waiting',
            timestamp
        });

        onDisconnect(userRef).remove();
    }, [roomId, userId, username]);

    // Démarre la caméra et le micro
    useEffect(() => {
        const startLocalStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            const interval = setInterval(() => {
                if (localStreamRef.current) {
                    localStreamRef.current.srcObject = stream;
                    stream.getTracks().forEach((track) => (track.enabled = true));
                    clearInterval(interval);
                }
            }, 100);
        };

        startLocalStream();
    }, []);

    const createPeerConnection = (remoteUserId) => {
        const pc = new RTCPeerConnection({ iceServers });

        if (localStream) {
            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
            console.log(`🎤 Track locale ajoutée à la peerConnection vers ${remoteUserId}`);
        }


        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidatesRef = ref(db, `rooms/${roomId}/signaling/iceCandidates`);
                push(candidatesRef, { candidate: event.candidate.toJSON(), from: userId });
            }
        };

        pc.ontrack = (event) => {
            console.log("✅ ontrack déclenché pour", remoteUserId, "🎥 stream =", event.streams[0]);
            setRemoteStreams((prev) => ({
                ...prev,
                [remoteUserId]: event.streams[0]
            }));

            const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
            update(userRef, { status: "connected", pseudo: username });
        };

        peerConnections.current[remoteUserId] = pc;
        return pc;
    };

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

        const unsubOffers = onChildAdded(offersRef, async (snapshot) => {
            const { offer, from } = snapshot.val();
            if (from === userId) return;

            let pc = peerConnections.current[from];
            if (!pc) {
                pc = createPeerConnection(from);
            }

            if (pc.signalingState === "stable" || pc.signalingState === "have-remote-offer") {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await push(ref(db, `rooms/${roomId}/signaling/answers`), {
                    answer: pc.localDescription.toJSON(),
                    from: userId
                });
                console.log(`✅ Réponse envoyée à ${from}`);
            } else {
                console.warn("❗ Ignored setting offer because signalingState is", pc.signalingState);
            }
        });

        const unsubAnswers = onChildAdded(answersRef, async (snapshot) => {
            const { answer, from } = snapshot.val();

            if (from === userId || receivedAnswers.current.has(from)) return;

            const pc = peerConnections.current[from];
            if (pc && pc.signalingState !== "stable") {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                    receivedAnswers.current.add(from);
                    console.log("✅ Réponse définie pour", from);
                } catch (err) {
                    console.error("❌ Erreur lors de setRemoteDescription(answer)", err);
                }
            } else {
                console.warn("⚠️ Réponse ignorée pour", from, "car signalingState =", pc?.signalingState);
            }
        });

        const unsubCandidates = onChildAdded(candidatesRef, async (snapshot) => {
            const { candidate, from } = snapshot.val();
            const pc = peerConnections.current[from];
            if (pc && pc.remoteDescription?.type) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("❌ Erreur lors de addIceCandidate", err);
                }
            }
        });

        const createOffers = async () => {
            const usersSnapshot = await get(ref(db, `rooms/${roomId}/users`));
            const users = usersSnapshot.val() || {};
            const myTimestamp = users[userId]?.timestamp;

            for (const remoteUserId of remoteUserIds.filter((id) => id !== userId)) {
                if (peerConnections.current[remoteUserId]) {
                    console.log(`⏩ Connexion déjà existante avec ${remoteUserId}`);
                    continue;
                }

                const remoteTimestamp = users[remoteUserId]?.timestamp;

                if (myTimestamp && remoteTimestamp && myTimestamp > remoteTimestamp) {
                    const pc = createPeerConnection(remoteUserId);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    await push(ref(db, `rooms/${roomId}/signaling/offers`), {
                        offer: pc.localDescription.toJSON(),
                        from: userId,
                        to: remoteUserId
                    });
                    console.log(`📤 Offre envoyée à ${remoteUserId}`);
                } else {
                    console.log(`⏳ J’attends une offre de ${remoteUserId}`);
                }
            }
        };

        createOffers();

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

            setRemoteStreams((prev) => {
                const updated = { ...prev };
                delete updated[userLeftId];
                return updated;
            });
        });

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        const handleUnload = () => {
            const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
            set(userRef, null);
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [roomId, userId]);

    return (
        <VideoSideBar
            roomId={roomId}
            localStreamRef={localStreamRef}
            localUserId={userId}
            remoteStreams={remoteStreams}
        />
    );
};

export default VideoCall;
