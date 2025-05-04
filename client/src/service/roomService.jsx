import {ref, update, remove, onDisconnect} from 'firebase/database';
import { db } from '../firebase.js';

// Rejoindre ou créer une room
export function joinRoom(roomId, userId, pseudo) {
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);

    update(userRef, {
        pseudo,
        videoEnabled: true,
        audioEnabled: true,
        status: "connecting",
    });

    onDisconnect(userRef).remove();
}

// Quitter une room
export function leaveRoom(roomId, userId) {
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);

    remove(userRef);
}