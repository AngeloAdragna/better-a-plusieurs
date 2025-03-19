class RoomManager {
    static #rooms = [];

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
