class Room {
    #id;
    #roomName;
    #ownerClient; // Client qui a créé la room
    #voteSkip; // Systeme de vote pour passer à la vidéo suivante
    #voteAdd; // systeme de vote pour ajouter une vidéo à la playlist
    #freeToShare; // Tout les participants a la room peuvent la partager

    constructor(id, name, voteSkip, ownerClient, voteAdd, freeToShare) {
        this.#id = id;
        this.#roomName = name;
        this.#voteSkip = voteSkip;
        this.#ownerClient = ownerClient;
        this.#voteAdd = voteAdd;
        this.#freeToShare = freeToShare;
    }

    setOwner(client) {
        this.#ownerClient = client;
    }

    changePreferences(voteSkip, voteAdd, freeToShare) {
        this.#voteSkip = voteSkip;
        this.#voteAdd = voteAdd;
        this.#freeToShare = freeToShare;
    }

    getClient() {
        return this.#ownerClient;
    }

    getVoteSkip() {
        return this.#voteSkip;
    }

    getVoteAdd() {
        return this.#voteAdd;
    }

    getFreeToShare() {
        return this.#freeToShare;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#roomName;
    }

    setName(name) {
        this.#roomName = name;
    }
}

export default Room;