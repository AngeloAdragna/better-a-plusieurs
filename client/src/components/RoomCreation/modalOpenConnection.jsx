import { useEffect, useState } from "react";
import RoomManager from "../../../../server/RoomManager";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const RoomParametersWindow = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        roomName: "",
        voteSkip: false,
        voteAdd: false,
        freeToShare: false,
    });

    useEffect(() => {
        const elems = document.querySelectorAll(".modal");
        M.Modal.init(elems);
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        let room = RoomManager.createRoom(formData.voteSkip, formData.voteAdd, formData.freeToShare);
        if (room && room.getId()) {
            navigate(`/room/${room.getId()}`);
        } else {
            M.toast({ html: "Erreur lors de la création de la salle" });
        }
    };

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <div id="modalCreate" className="modal">
            <div className="modal-content black-text">
                <form onSubmit={onSubmit}>
                    <h5>Se connecter</h5>

                    <div className="input-field">
                        <input
                            type="text"
                            name="pseudo"
                            value={formData.pseudo}
                            onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                        />
                        <label htmlFor="pseudo">Nom d'utilisateur</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="mdp"
                            value={formData.mdp}
                            onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
                        />
                        <label htmlFor="mdp">Mot de passe</label>
                    </div>
                    <button type="submit" className="btn waves-effect waves-light">
                       Connexion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomParametersWindow;
