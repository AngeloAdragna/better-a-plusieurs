import Room from './Room.js';

class RoomManager {
    static #rooms = [];

    static createRoom(name, voteSkip, voteAdd, freeToShare) {
        const room = new Room(crypto.randomUUID(), name, voteSkip, voteAdd, freeToShare);
        this.#rooms.push(room);
        return room;
    }

    static addRoom(room) {
        this.#rooms.push(room);
    }

    static removeRoom(room) {
        this.#rooms = this.#rooms.filter((r) => r !== room);
    }

    static changeRoomParameters(roomId, voteSkip, voteAdd, freeToShare) {
        const room = this.#rooms.find((r) => r.getId() === roomId);
        room.changePreferences(voteSkip, voteAdd, freeToShare);
    }

    static getRooms() {
        return this.#rooms;
    }

    static getRoomById(id) {
        return this.#rooms.find((r) => r.getId() === id);
    }
}

export default RoomManager;
