import { useParams } from "react-router-dom";

function Room() {
    const { roomId } = useParams();

    return (
        <div>
            <h1>Room ID:{roomId}</h1>
            <p>Bienvenue dans la salle (get le nom de la room via l'API).</p>
        </div>
    );
}

export default Room;
