class Room {
    #id;
    #roomName;
    #ownerClient; // Client qui a créé la room
    #voteSkip; // Systeme de vote pour passer à la vidéo suivante
    #voteAdd; // systeme de vote pour ajouter une vidéo à la playlist
    #freeToShare; // Tout les participants a la room peuvent la partager
    #voteOuiToSkip; // Nombre de votes pour passer à la vidéo suivante
    #voteNonToSkip; // Nombre de votes pour ne pas passer à la vidéo suivante
    #voteOuiToAdd; // Nombre de votes pour ajouter une vidéo à la playlist
    #voteNonToAdd; // Nombre de votes pour ne pas ajouter une vidéo à la playlist
    #currentVoteType; // Type de vote en cours (skip ou add)
    #currentVotedVideo; // Vidéo sur laquelle le vote est en cours
    #videoPlaylist;   // Vidéos de la playlist
    #videoHistory;   // Historique des vidéos jouées

    constructor(id, name, voteSkip, ownerClient, voteAdd, freeToShare) {
        this.#id = id;
        this.#roomName = name;
        this.#voteSkip = voteSkip;
        this.#ownerClient = ownerClient;
        this.#voteAdd = voteAdd;
        this.#freeToShare = freeToShare;
        this.#voteOuiToSkip = 0; // Nombre de votes pour passer à la vidéo suivante
        this.#voteNonToSkip = 0; // Nombre de votes pour ne pas passer à la vidéo suivante
        this.#voteOuiToAdd = 0; // Nombre de votes pour ajouter une vidéo à la playlist
        this.#voteNonToAdd = 0; // Nombre de votes pour ne pas ajouter une vidéo à la playlist
        this.#videoPlaylist = [];
        this.#videoHistory = [];
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
        console.log("Ajout de la vidéo à la playlist :", this.#videoPlaylist);
    }

    // Ajout d’une vidéo à l’historique
    addVideoToHistory(video) {
        this.#videoHistory.push(video);
        console.log("Ajout de la vidéo à l'historique :", this.#videoHistory);
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

    startVote(voteType, video = null) {
        if (this.#currentVoteType) {
            console.log("Un vote est déjà en cours");
            return;
        }

        if (!["skip", "add"].includes(voteType)) {
            console.log("Type de vote invalide");
            return;
        }

        if (voteType === "skip" && !this.#voteSkip) {
            console.log("Le vote pour passer à la vidéo suivante n'est pas activé");
            return;
        }

        if (voteType === "add") {
            if (!this.#voteAdd) {
                console.log("Le vote pour ajouter une vidéo à la playlist n'est pas activé");
                return;
            }
            if (!video) {
                console.log("Aucune vidéo à ajouter");
                return;
            }
            this.#currentVotedVideo = video;
        } else {
            this.#currentVotedVideo = null;
        }
        this.#currentVoteType = voteType;
    }


    getVoteStats() {
        if (this.#currentVoteType === "skip") {
            return {
                voteType: this.#currentVoteType,
                oui: this.#voteOuiToSkip,
                non: this.#voteNonToSkip,
            };
        } else if (this.#currentVoteType === "add") {
            return {
                voteType: this.#currentVoteType,
                oui: this.#voteOuiToAdd,
                non: this.#voteNonToAdd,
            };
        } else {
            return null;
        }
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
