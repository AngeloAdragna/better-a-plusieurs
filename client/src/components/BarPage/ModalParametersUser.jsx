import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const ModalParametersUser = ({roomId, socket}) => {
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

    useEffect(() => {
        fetch(`http://${import.meta.env.VITE_SERVER_IP}:8080/room/${roomId}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    roomName: data.name || "",
                    voteSkip: data.voteSkip || false,
                    voteAdd: data.voteAdd || false,
                    freeToShare: data.freeToShare || false,
                });
            })
            .catch((err) => console.error("Erreur chargement room :", err));
    }, [roomId]);



    const onSubmit = (event) => {
        event.preventDefault();
        socket.emit("updateRoomParameters", {
            roomId,
            roomName: formData.roomName,
            voteSkip: formData.voteSkip,
            voteAdd: formData.voteAdd,
            freeToShare: formData.freeToShare
        });

        const modalInstance = M.Modal.getInstance(document.getElementById("ModalParametersUser"));
        modalInstance.close();
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
          <button type="submit" className="btnHover" style={{ margin: "20px" }}>Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default ModalParametersUser;
