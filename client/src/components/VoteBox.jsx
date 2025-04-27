import { useEffect, useState } from "react";
import "../styles/VoteBox.css";
import M from "materialize-css";

const VoteBox = ({roomId, socket}) => {
    const [voteType, setVoteType] = useState(null); // 'skip' ou 'add'
    const [videoName, setVideoName] = useState("");
    const [votesOui, setVotesOui] = useState(0);
    const [votesNon, setVotesNon] = useState(0);

    useEffect(() => {
        M.AutoInit();
    }, []);

    useEffect(() => {
        socket.on("voteToSkip", (data) => {
            if (voteType == null) {
                setVoteType("skip");
                setVotesOui(0);
                setVotesNon(0);
            }
            if (data.vote === "oui") {
                setVotesOui((prev) => prev + 1);
            } else if (data.vote === "non") {
                setVotesNon((prev) => prev + 1);
            }
        });

        socket.on("voteToAdd", (data) => {
            if (voteType == null) {
                setVoteType("add");
                setVideoName(data.videoName || "vidéo inconnue");
                setVotesOui(0);
                setVotesNon(0);
            }
            if (data.vote === "oui") {
                setVotesOui((prev) => prev + 1);
            } else if (data.vote === "non") {
                setVotesNon((prev) => prev + 1);
            }
        });

        socket.on("voteEnded", (data) => {
            setVoteType(null);
            setVideoName("");
            setVotesOui(0);
            setVotesNon(0);
            // Todo : print data.result => videoname ajoutée ou skippée
        } );

        return () => {
            socket.off("voteToSkip");
            socket.off("voteToAdd");
            socket.off("voteEnded");
        };
    }, []);

    const handleVote = (choice) => {
        if (choice === "oui") {
            setVotesOui((prev) => prev + 1);
        } else if (choice === "non") {
            setVotesNon((prev) => prev + 1);
        }
        // Tu peux aussi socket.emit ici si nécessaire
    };

    const getTotalVotes = () => votesOui + votesNon;

    const getPourcentageOui = () => {
        const total = getTotalVotes();
        if (total === 0) return 50;
        return (votesOui / total) * 100;
    };

    const getPourcentageNon = () => {
        const total = getTotalVotes();
        if (total === 0) return 50;
        return (votesNon / total) * 100;
    };

    if (!voteType) {
        return null; // Aucun vote en cours
    }

    return (
        <div className="vote-box">
            <h5 className="vote-title">
                {voteType === "add"
                    ? `Vote pour ajouter "${videoName}"`
                    : "Vote pour skipper la vidéo"}
            </h5>

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
                    className="btn green vote-button"
                    onClick={() => handleVote("oui")}
                >
                    Oui
                </button>
                <button
                    className="btn red vote-button"
                    onClick={() => handleVote("non")}
                >
                    Non
                </button>
            </div>
        </div>
    );
};

export default VoteBox;
