import React, { useState, useEffect } from "react"; 
import ModalRoomParameters from "./ModalRoomParameters";
import M from "materialize-css";

const ModalOpenConnection = ({ onlyConnection }) => {
    const [formData, setFormData] = useState({
      pseudo: "",
      mdp: "",
    });

  useEffect(() => {
    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    // Fermer le premier modal
    const modalInstance = M.Modal.getInstance(document.getElementById("modalCreate"));
    modalInstance.close();

    if(!onlyConnection) {
      // Ouvrir le deuxième modal après un léger délai
      setTimeout(() => {
        const roomModal = M.Modal.getInstance(document.getElementById("modalRoomParameters"));
        if (roomModal) roomModal.open();
      }, 300);
    }

  };

  return (
    <>
      {/* Premier Modal */}
      <div id="modalCreate" className="modal">
        <div className="modal-content">
          <h5>Connexion</h5>
          <form onSubmit={onSubmit}>
            <div className="input-field">
              <input type="text" name="pseudo"
                value={formData.pseudo}
                onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
               />
              <label htmlFor="pseudo">Nom d'utilisateur</label>
            </div>
            <div className="input-field">
              <input type="password" name="mdp"
                value={formData.mdp}
                onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
               />
              <label htmlFor="mdp">Mot de passe</label>
            </div>

            <button type="submit" className="btn waves-effect waves-light">
              Se connecter
            </button>
          </form>
        </div>
      </div>

      {/* Deuxième Modal */}
      <ModalRoomParameters />
    </>
  );
};

export default ModalOpenConnection;