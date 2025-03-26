import { useState } from "react";
import RoomParametersWindow from "./RoomParametersWindow.jsx";

const TestRoomCreation = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal1" onClick={() => setModalOpen(true)}>
                Ouvrir le Modal
            </a>
            {modalOpen && <RoomParametersWindow />}
        </div>
    );
};

export default TestRoomCreation;

/*

  return (
    <>
      <div id="modalCreate" className="modal">
        <div className="modal-content black-text">
          <form onSubmit={onSubmit}>
            <h5>Se connecter</h5>

            <div className="input-field">
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleChange}
              />
              <label htmlFor="pseudo">Nom d'utilisateur</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                name="mdp"
                value={formData.mdp}
                onChange={handleChange}
              />
              <label htmlFor="mdp">Mot de passe</label>
            </div>
            <button type="submit" className="btn waves-effect waves-light">
              Connexion
            </button>
          </form>
        </div>
      </div>

      {isRoomModalOpen && (
        <RoomParametersWindow
          onClose={() => setIsRoomModalOpen(false)} // Une fonction pour fermer ce modal
        />
      )}
    </>
  );*/