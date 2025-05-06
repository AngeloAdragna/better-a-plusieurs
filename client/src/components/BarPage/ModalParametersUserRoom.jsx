import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const ModalParametersUserRoom = ({owner}) => {
  const navigate = useNavigate();
  // exemple
  const [formData, setFormData] = useState({
    url: "",
  });

  // Initialize the modal
  useEffect(() => {
    const elem = document.getElementById("ModalParametersUserRoom");
    if (elem) {
      M.Modal.init(elem);
    }
  }, []);

  
  const onSubmit = (event) => {
    event.preventDefault();
    //TODO Si la room existe, rediriger vers la room avec son url
  
  };
 
  return (
    <div id="ModalParametersUserRoom" className="modal">
      <div className="modal-content">
        <h5>Paramètres de la room de l'utilisateur</h5>
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
      </div>
    </div>
  );
};

export default ModalParametersUserRoom;
