import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import { joinRoom } from "../../service/roomService";
import { AuthContext } from "../../context/AuthContext";

const ModalJoinParameters = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

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

  const onSubmit = (event) => {
    event.preventDefault();

    if (formData.url && currentUser) {
      joinRoom(formData.url, currentUser.uid, currentUser.displayName || "Anonyme");
      navigate(`/room/${formData.url}`);
    } else {
      alert("Tu dois être connecté pour rejoindre une salle !");
    }
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

            <button type="submit" className="btn waves-effect waves-light">Rejoindre</button>
          </form>
        </div>
      </div>
  );
};

export default ModalJoinParameters;