import Room from './Room.js';
import crypto from 'crypto';

class RoomManager {
    static #rooms = [];

    static createRoom(name, voteSkip, votePlay, publicRoom, ownerClient = null) {
      const room = new Room(crypto.randomUUID(), name, voteSkip, votePlay, publicRoom, ownerClient);
      this.#rooms.push(room);
      return room;
    }

    static addRoom(room) {
        this.#rooms.push(room);
    }

    static removeRoom(room) {
        this.#rooms = this.#rooms.filter((r) => r !== room);
    }

    static changeRoomParameters(roomId, voteSkip, votePlay, publicRoom) {
        const room = this.#rooms.find((r) => r.getId() === roomId);
        room.changePreferences(voteSkip, votePlay, publicRoom);
    }

    static getRooms() {
        return this.#rooms;
    }

    static getRoomById(id)  {
        return this.#rooms.find((r) => r.getId() === id);
    }

    static getOpenRooms() {
        return this.#rooms.filter((r) => r.getpublicRoom());
    }
}

export default RoomManager;
