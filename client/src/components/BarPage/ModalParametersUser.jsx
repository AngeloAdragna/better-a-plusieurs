import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const ModalParametersUser = () => {
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
    const elem = document.getElementById("ModalParametersUser");
    if (elem) {
      M.Modal.init(elem);
    }
  }, []);

  
  const onSubmit = (event) => {
    event.preventDefault();
    //TODO Si la room existe, rediriger vers la room avec son url
  
  };
 
  // Handle the change of the switches
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div id="ModalParametersUser" className="modal">
      <div className="modal-content">
        <h5>Paramètres de la room</h5>
        <form onSubmit={onSubmit}>
        <div className="input-field">
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            />
            <label htmlFor="roomName">Nouveau nom de la Room</label>
          </div>

          <div className="switchdiv">
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
          </div>
          <btn type="submit" className="btnHover" style={{ margin: "20px" }}>Modifier</btn>
        </form>
      </div>
    </div>
  );
};

export default ModalParametersUser;
