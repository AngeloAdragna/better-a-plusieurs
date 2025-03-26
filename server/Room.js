class Room {
    #id;
    #roomName;
    #clients;
    #voteSkip; // Systeme de vote pour passer à la vidéo suivante
    #voteAdd; // systeme de vote pour ajouter une vidéo à la playlist
    #freeToShare; // Tout les participants a la room peuvent la partager

    constructor(id,name, voteSkip, voteAdd, freeToShare) {
        this.#id = id;
        this.#roomName = name;
        this.#clients = [];
        this.#voteSkip = voteSkip;
        this.#voteAdd = voteAdd;
        this.#freeToShare =freeToShare;
    }

    addClient(client) {
        this.#clients.push(client);
    }

    removeClient(client) {
        this.#clients = this.#clients.filter((c) => c !== client);
    }

    changePreferences(voteSkip, voteAdd, freeToShare) {
        this.#voteSkip = voteSkip;
        this.#voteAdd = voteAdd;
        this.#freeToShare = freeToShare;
    }

    getClients() {
        return this.#clients;
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

    getName(){
        return this.#roomName;
    }

    setName(name){
        this.#roomName = name;
    }
}

export default Room;