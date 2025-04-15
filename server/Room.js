class Room {
    #id;
    #roomName;
    #ownerClient; // Client qui a créé la room
    #voteSkip; // Systeme de vote pour passer à la vidéo suivante
    #voteAdd; // systeme de vote pour ajouter une vidéo à la playlist
    #freeToShare; // Tout les participants a la room peuvent la partager
    #videoPlaylist = [];   // ← Ajout
    #videoHistory = [];    // ← Ajout

    constructor(id, name, voteSkip, voteAdd, freeToShare, ownerClient) {
      this.#id = id;
      this.#roomName = name;
      this.#voteSkip = voteSkip;
      this.#ownerClient = ownerClient;
      this.#voteAdd = voteAdd;
      this.#freeToShare = freeToShare;
    }

    // Méthodes d’accès aux vidéos
    getVideoPlaylist() {
        return this.#videoPlaylist;
    }

    getVideoHistory() {
        return this.#videoHistory;
    }

    // Ajout d’une vidéo à la playlist
    addVideoToPlaylist(video) {
        this.#videoPlaylist.push(video);
    }

    // Ajout d’une vidéo à l’historique
    addVideoToHistory(video) {
        this.#videoHistory.push(video);
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

    getOwnerClient() {
        return this.#ownerClient;
    }

    setName(name) {
        this.#roomName = name;
    }

  toJSON() {
    return {
      id: this.#id,
      name: this.#roomName,
      voteSkip: this.#voteSkip,
      voteAdd: this.#voteAdd,
      freeToShare: this.#freeToShare,
      ownerClient: this.#ownerClient,
    };
  }

}

export default Room;
