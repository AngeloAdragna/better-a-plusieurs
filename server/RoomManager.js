class RoomManager {
    #rooms;
    constructor() {
        this.#rooms = [];
    }

    addRoom(room) {
        this.#rooms.push(room);
    }

    removeRoom(room) {
        this.#rooms = this.#rooms.filter((r) => r !== room);
    }

    getRooms() {
        return this.#rooms;
    }

    getRoomById(id) {
        return this.#rooms.find((r) => r.getId() === id);
    }
}