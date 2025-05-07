import { useEffect, useState } from "react";
import "../styles/VoteBox.css";
import M from "materialize-css";


const VoteBox = ({roomId, socket}) => {
    /**
     * Objet `currentVoteInfos`
     *
     * Contient toutes les informations liées à un vote en cours.
     *
     * Structure :
     * {
     *   id: number,            // ID unique du vote (généré aléatoirement ou automatiquement)
     *   voteType: "add" | "skip" | null, // Type de vote : "add" pour ajouter une vidéo, "skip" pour passer une vidéo, null si aucun vote
     *   author: string,         // Nom ou identifiant de l'utilisateur qui a lancé le vote
     *   nbrVotesYes: number,    // Nombre de votes "oui"
     *   nbrVotesNo: number,     // Nombre de votes "non"
     *   videoName: string | null // Nom de la vidéo concernée (uniquement pour un vote "add"), null sinon
     * }
     */
    const [currentVoteInfos, setCurrentVoteInfos] = useState({
        id: null,
        voteType: null,
        author: "",
        nbrVotesYes: 0,
        nbrVotesNo: 0,
        videoName: null,
    });

    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [voteResult, setVoteResult] = useState(null);


    useEffect(() => {
        M.AutoInit();
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        const handleVoteStarted = ({ id, voteType, author, videoName }) => {
            setCurrentVoteInfos({
                id,
                voteType,
                author,
                videoName: videoName,
                nbrVotesYes: 0,
                nbrVotesNo: 0,
            });
            setTimeLeft(15);
            setIsVisible(true);
        };

        const handleNewVote = ({ id, vote }) => {
            setCurrentVoteInfos((prev) => {
                if (prev.id !== id) return prev;
                if (vote === "oui") {
                    return { ...prev, nbrVotesYes: prev.nbrVotesYes + 1 };
                } else if (vote === "non") {
                    return { ...prev, nbrVotesNo: prev.nbrVotesNo + 1 };
                }
                return prev;
            });
        };

        const handleVoteEnded = ({ id, result }) => {
            if (currentVoteInfos.id === id) {
                setTimeLeft(0);
                setVoteResult({
                    success: result,
                    voteType: currentVoteInfos.voteType,
                    videoName: currentVoteInfos.videoName,
                })
                setCurrentVoteInfos({
                    id: null,
                    voteType: null,
                    author: "",
                    nbrVotesYes: 0,
                    nbrVotesNo: 0,
                    videoName: null,
                });
                setTimeout(() => {
                    setVoteResult(null);
                    setIsVisible(false);
                }, 3000);
            }
        };

        socket.on("voteStarted", handleVoteStarted);
        socket.on("newVote", handleNewVote);
        socket.on("voteEnded", handleVoteEnded);

        return () => {
            socket.off("voteStarted", handleVoteStarted);
            socket.off("newVote", handleNewVote);
            socket.off("voteEnded", handleVoteEnded);
        };
    }, [socket, currentVoteInfos.id]);


    const handleVote = (choice) => {
        socket.emit("vote", {
            roomId,
            id: currentVoteInfos.id,
            vote: choice,
        });
        disableButtons()
    };

    const disableButtons = () => {
        const yesButton = document.getElementById('vote-yes-btn');
        const noButton = document.getElementById('vote-no-btn');

        if (yesButton) yesButton.disabled = true;
        if (noButton) noButton.disabled = true;
    };


    const getTotalVotes = () => currentVoteInfos.nbrVotesYes + currentVoteInfos.nbrVotesNo;

    const getPourcentageOui = () => {
        const total = getTotalVotes();
        if (total === 0) return 50;
        return (currentVoteInfos.nbrVotesYes / total) * 100;
    };

    const getPourcentageNon = () => {
        const total = getTotalVotes();
        if (total === 0) return 50;
        return (currentVoteInfos.nbrVotesNo / total) * 100;
    };

    return (
        <div className="vote-box" style={{ display: isVisible ? "block" : "none" }}>
            {voteResult ? (
                <div className="vote-result">
                    <h5 className="vote-title">
                        {voteResult.success
                            ? voteResult.voteType === "skip"
                                ? "La vidéo a été passée !"
                                : `Lancement de la vidéo "${voteResult.videoName}" !`
                            : voteResult.voteType === "skip"
                                ? "La vidéo n'a pas été passée."
                                : `Annulation du lancement de la vidéo "${voteResult.videoName}"...`}
                    </h5>
                </div>
            ) : (
                <>
                    <div className="vote-timer">{timeLeft}s</div>

                    <h5 className="vote-title">
                        {currentVoteInfos.voteType === "add"
                            ? `Vote pour lancer "${currentVoteInfos.videoName}"`
                            : "Vote pour passer la vidéo"}
                    </h5>
                    <p className="vote-author">
                        Proposé par : {currentVoteInfos.author}
                    </p>
                    <div className="vote-progress">
                        <div
                            className="vote-progress-bar green"
                            style={{ width: `${getPourcentageOui()}%` }}
                        >
                    <span className="vote-progress-text">
                        {Math.round(getPourcentageOui())}%
                    </span>
                        </div>
                        <div
                            className="vote-progress-bar red"
                            style={{ width: `${getPourcentageNon()}%` }}
                        >
                    <span className="vote-progress-text">
                        {Math.round(getPourcentageNon())}%
                    </span>
                        </div>
                    </div>

                    <div className="vote-buttons">
                        <button
                            id="vote-yes-btn"
                            className="btn green vote-button"
                            onClick={() => handleVote("oui")}
                        >
                            Oui
                        </button>
                        <button
                            id="vote-no-btn"
                            className="btn red vote-button"
                            onClick={() => handleVote("non")}
                        >
                            Non
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VoteBox;
