import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import { ref, onChildAdded, push, set, get } from 'firebase/database';
import VideoSideBar from './VideoSideBar';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

const VideoCall = ({ roomId, userId }) => {
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
            const remoteVideo = document.getElementById(`video-${remoteUserId}`);
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        peerConnections.current[remoteUserId] = pc;
        return pc;
    };

    const [localStream, setLocalStream] = useState(null);

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
        if (!localStream) return;

        const offersRef = ref(db, `rooms/${roomId}/signaling/offers`);
        const answersRef = ref(db, `rooms/${roomId}/signaling/answers`);
        const candidatesRef = ref(db, `rooms/${roomId}/signaling/iceCandidates`);

        // Quand quelqu'un envoie une offre
        onChildAdded(offersRef, async (snapshot) => {
            const { offer, from } = snapshot.val();
            if (from === userId) return;

            let peerConnection = peerConnections.current[from];
            if (!peerConnection) {
                peerConnection = createPeerConnection(from);
            }

            if (
                peerConnection.signalingState === "stable" ||
                peerConnection.signalingState === "have-remote-offer"
            ) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                await push(answersRef, { answer: peerConnection.localDescription.toJSON(), from: userId });
            } else {
                console.warn("❗ Ignored setting offer because signalingState is", peerConnection.signalingState);
            }
        });

        // Quand quelqu'un envoie une réponse
        onChildAdded(answersRef, async (snapshot) => {
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

        // Quand quelqu'un envoie un candidat ICE
        onChildAdded(candidatesRef, async (snapshot) => {
            const { candidate, from } = snapshot.val();
            const pc = peerConnections.current[from];
            if (pc && pc.remoteDescription && pc.remoteDescription.type) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        const createOffer = async () => {
            const offersSnapshot = await get(offersRef);
            if (offersSnapshot.exists()) {
                console.log("⚠️ Une offre existe déjà, j'attends.");
                return;
            }
            const peerConnection = createPeerConnection(userId);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await push(offersRef, { offer: peerConnection.localDescription.toJSON(), from: userId });
            console.log("📤 Nouvelle offre envoyée !");
        };

        createOffer();
    }, [localStream, roomId, userId]);

    return (
        <>
            <VideoSideBar roomId={roomId} localStreamRef={localStreamRef} localUserId={userId} />
        </>
    );
};

export default VideoCall;