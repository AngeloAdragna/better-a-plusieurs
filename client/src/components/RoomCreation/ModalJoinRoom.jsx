import { useEffect, useState } from "react";
import RoomManager from "../../../../server/RoomManager";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const ModalRoomParameters = () => {
  const navigate = useNavigate();

  // State for the form data
  const [formData, setFormData] = useState({
    url: "",
  });

  // Initialize the modal
  useEffect(() => {
    const elem = document.getElementById("ModalJoinRoom");
    if (elem) {
      M.Modal.init(elem);
    }
  }, []);

  
  // Create a room
  const onSubmit = (event) => {
    event.preventDefault();
    //TODO Si la room existe, rediriger vers la room avec son url
    /*
    if (room && room.getUrl()) {
      navigate(`/room/${room.getUrl()}`);
    } else {
      M.toast({ html: "Erreur pour rejoindre  la salle" });
    }*/
  };
 
  return (
    <div id="ModalJoinRoom" className="modal">
      <div className="modal-content">
        <h5>Rejoindre une room existante</h5>
        <form onSubmit={onSubmit}>
          <div className="input-field">
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <label htmlFor="url">Url de la Room</label>
          </div>

          <button type="submit" className="btn waves-effect waves-light">Créer</button>
        </form>
         {/* Affichage conditionnel de la bonne modale 
        <button className="modal-close btn red">Fermer</button>
        */}
      </div>
    </div>
  );
};

export default ModalRoomParameters;
