import { useState, useEffect } from "react";
import RoomParametersWindow from "./RoomParametersWindow";
import M from "materialize-css";

const ModalOpenConnection = () => {
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false); // État pour gérer le second modal

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
    const modalInstance = M.Modal.getInstance(document.getElementById("modalCreate"));
    modalInstance.close(); // Ferme le premier modal
    setIsRoomModalOpen(true); // Ouvre le deuxième modal

    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
  };

  return (
    <>
      <div id="modalCreate" className="modal">
        <div className="modal-content">
          <h5>Connexion</h5>
          <form onSubmit={onSubmit}>
            <h5>Se connecter</h5>
            
            <div className="input-field">
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              />
              <label htmlFor="pseudo">Nom d'utilisateur</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                name="mdp"
                value={formData.mdp}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              />
              <label htmlFor="mdp">Mot de passe</label>
            </div>

    
            <button type="submit" className="btn waves-effect waves-light">
            Se connecter
            </button>
          </form>
        </div>
      </div>

      {isRoomModalOpen && <RoomParametersWindow />} {/* Appel du deuxième modal */}
    </>
  );
};

export default ModalOpenConnection;