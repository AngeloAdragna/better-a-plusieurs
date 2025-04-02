import { useEffect, useState } from "react";
import RoomManager from "../../../../server/RoomManager";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const ModalRoomParameters = () => {
  const navigate = useNavigate();

  // State for the form data
  const [formData, setFormData] = useState({
    roomName: "",
    voteSkip: false,
    voteAdd: false,
    freeToShare: false,
  });

  // Initialize the modal
  useEffect(() => {
    const elem = document.getElementById("modalRoomParameters");
    if (elem) {
      M.Modal.init(elem);
    }
  }, []);

  // Create a room
  const onSubmit = (event) => {
    event.preventDefault();
    let room = RoomManager.createRoom(formData.voteSkip, formData.voteAdd, formData.freeToShare);
    if (room && room.getId()) {
      navigate(`/room/${room.getId()}`);
    } else {
      M.toast({ html: "Erreur lors de la création de la salle" });
    }
  };

  // Handle the change of the switches
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div id="modalRoomParameters" className="modal">
      <div className="modal-content">
        <h5>Paramètres de la Room</h5>
        <form onSubmit={onSubmit}>
          <div className="input-field">
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            />
            <label htmlFor="roomName">Nom de la Room</label>
          </div>

          <div className="switch">
            <label>
              Vote pour skip
              <input type="checkbox" name="voteSkip" checked={formData.voteSkip} onChange={handleChange} />
              <span className="lever"></span>
            </label>
          </div>

          <div className="switch">
            <label>
              Vote pour add
              <input type="checkbox" name="voteAdd" checked={formData.voteAdd} onChange={handleChange} />
              <span className="lever"></span>
            </label>
          </div>

          <div className="switch">
            <label>
              Free to share
              <input type="checkbox" name="freeToShare" checked={formData.freeToShare} onChange={handleChange} />
              <span className="lever"></span>
            </label>
          </div>

          <button type="submit" className="btn waves-effect waves-light">Créer</button>
        </form>
        <button className="modal-close btn red">Fermer</button>
      </div>
    </div>
  );
};

export default ModalRoomParameters;
