class Room {
    #id;
    #roomName;
    #ownerClient; // Client qui a créé la room
    #voteSkip; // Systeme de vote pour passer à la vidéo suivante
    #voteAdd; // systeme de vote pour ajouter une vidéo à la playlist
    #freeToShare; // Tout les participants a la room peuvent la partager
    #videoPlaylist;   // Vidéos de la playlist
    #videoHistory;   // Historique des vidéos jouées

    /**
     * [
     * id : string, // ID unique du vote
     * voteType: "add" | "skip" | null, // Type de vote : "add" pour ajouter une vidéo, "skip" pour passer une vidéo, null si aucun vote
     * author: string,         // Nom ou identifiant de l'utilisateur qui a lancé le vote
     * nbrVotesYes: number,    // Nombre de votes "oui"
     * nbrVotesNo: number,     // Nombre de votes "non"
     * videoName: string | null // Nom de la vidéo concernée (uniquement pour un vote "add"), null sinon
     * ]
     */
    #currentVoteInfos = {
        id: null,
        voteType: null,
        author: "",
        nbrVotesYes: 0,
        nbrVotesNo: 0,
        videoName: null,
    };

    constructor(id, name, voteSkip, voteAdd, freeToShare, ownerClient = null) {
        this.#id = id;
        this.#roomName = name;
        this.#voteSkip = voteSkip;
        this.#ownerClient = ownerClient;
        this.#voteAdd = voteAdd;
        this.#freeToShare = freeToShare;
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

    removeVideoFromPlaylist(video) {
        // Suppression de la première occurrence de la vidéo dans la playlist
        const index = this.#videoPlaylist.findIndex(v => v.id === video.id);
        if (index !== -1) {
            this.#videoPlaylist.splice(index, 1);
        }
        return this.#videoPlaylist
    }

    // Ajout d’une vidéo à l’historique
    addVideoToHistory(video) {
        this.#videoHistory = this.#videoHistory.filter(v => v.id !== video.id);
        this.#videoHistory.unshift(video);      // Ajout au début de l'historique (les plus récentes en premier)
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

    getCurrentVoteInfos() {
        return this.#currentVoteInfos;
    }

    startVote(id, voteType, author, video = null) {
        if (this.#currentVoteInfos.voteType !== null) {
            console.log("Un vote est déjà en cours.");
            return false;
        }

        this.#currentVoteInfos.id = id;
        this.#currentVoteInfos.voteType = voteType;
        this.#currentVoteInfos.author = author
        this.#currentVoteInfos.videoName = video;
        this.#currentVoteInfos.nbrVotesYes = 0;
        this.#currentVoteInfos.nbrVotesNo = 0;

        return true;
    }

    vote(id, vote) {
        if (this.#currentVoteInfos.id !== id) {
            return false;
        }
        if (vote === "oui") {
            this.#currentVoteInfos.nbrVotesYes++;
        } else if (vote === "non") {
            this.#currentVoteInfos.nbrVotesNo++;
        }
        return true;
    }

    // Vérifie si la majorité de OUI est atteinte pour le vote
    isMajority() {
        const totalVotes = this.#currentVoteInfos.nbrVotesYes + this.#currentVoteInfos.nbrVotesNo;
        const majority = Math.floor(totalVotes / 2) + 1;
        return this.#currentVoteInfos.nbrVotesYes >= majority;
    }

    endVote(id) {
        let result = this.isMajority()
        this.#currentVoteInfos.id = null;
        this.#currentVoteInfos.voteType = null;
        this.#currentVoteInfos.author = "";
        this.#currentVoteInfos.nbrVotesYes = 0;
        this.#currentVoteInfos.nbrVotesNo = 0;
        this.#currentVoteInfos.videoName = null;
        return result;
    }

  toJSON() {
    return {
      id: this.#id,
      name: this.#roomName,
      voteSkip: this.#voteSkip,
      voteAdd: this.#voteAdd,
      freeToShare: this.#freeToShare,
      ownerClient: this.#ownerClient,
      videoPlaylist: this.#videoPlaylist,
    };
  }

}

export default Room;
