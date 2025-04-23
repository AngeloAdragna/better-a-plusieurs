import React, { useEffect, useRef, useState } from "react";
import {db} from "../../firebase.js";
import { onValue, ref, set, push } from "firebase/database";
import VideoTile from "./VideoTile.jsx";
import VisioSidebar from "./VideoSideBar.jsx";


const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function VideoCall({ roomId, userId }) {
  const [remoteStreams, setRemoteStreams] = useState({});
  const peerConnections = useRef({});
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    // Obtenir le flux local
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setLocalStream(stream);
      registerUser();
    });

    // Enregistrer l'utilisateur dans la room
    const registerUser = () => {
      set(ref(db, `rooms/${roomId}/users/${userId}`), true);
    };

    // Écouter les autres utilisateurs de la room
    const usersRef = ref(db, `rooms/${roomId}/users`);
    onValue(usersRef, snapshot => {
      const users = snapshot.val() || {};
      const others = Object.keys(users).filter(uid => uid !== userId);
      setRemoteUsers(others);
    });

    // Écouter les offres entrantes
    const signalingRef = ref(db, `rooms/${roomId}/signaling`);
    onValue(signalingRef, snapshot => {
      const data = snapshot.val() || {};
      Object.entries(data).forEach(([key, msg]) => {
        const [from, to] = key.split("_to_");
        if (to !== userId) return;

        if (msg.offer) handleOffer(from, msg.offer);
        if (msg.answer) handleAnswer(from, msg.answer);
        if (msg.candidates) {
          msg.candidates.forEach(c => handleCandidate(from, c));
        }
      });
    });
  }, []);

  useEffect(() => {
    // Initier connexions pour chaque utilisateur distant
    remoteUsers.forEach(remoteUserId => {
      if (peerConnections.current[remoteUserId]) return;

      const pc = new RTCPeerConnection(servers);
      peerConnections.current[remoteUserId] = pc;

      // Ajouter les tracks
      localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

      // Gérer les flux entrants
      pc.ontrack = event => {
        setRemoteStreams(prev => ({ ...prev, [remoteUserId]: event.streams[0] }));
      };

      // Gérer les ICE candidates
      pc.onicecandidate = event => {
        if (event.candidate) {
          const path = `rooms/${roomId}/signaling/${userId}_to_${remoteUserId}`;
          const entryRef = ref(db, path + "/candidates");
          push(entryRef, event.candidate.toJSON());
        }
      };

      // Créer et envoyer une offre
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
        set(ref(db, `rooms/${roomId}/signaling/${userId}_to_${remoteUserId}/offer`), offer);
      });
    });
  }, [remoteUsers, localStream]);

  const handleOffer = async (from, offer) => {
    const pc = new RTCPeerConnection(servers);
    peerConnections.current[from] = pc;

    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = event => {
      setRemoteStreams(prev => ({ ...prev, [from]: event.streams[0] }));
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        const entryRef = ref(db, `rooms/${roomId}/signaling/${userId}_to_${from}/candidates`);
        push(entryRef, event.candidate.toJSON());
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await set(ref(db, `rooms/${roomId}/signaling/${userId}_to_${from}/answer`), answer);
  };

  const handleAnswer = async (from, answer) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = async (from, candidate) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

    return (
        <VisioSidebar localStream={localStream} remoteStreams={remoteStreams} />
    );
}