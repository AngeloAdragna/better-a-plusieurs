import { useState } from "react";
import ModalRoomParameters from "./ModalRoomParameters.jsx";

const TestRoomCreation = () => {
    const [modalOpen, setModalOpen] = useState(false);
  

    return (
        <div>
            <a className="waves-effect waves-light btn modal-trigger" href="#modalRoomParameters" onClick={() => setModalOpen(true)}>
                Ouvrir le Modal
            </a>
            {modalOpen && <ModalRoomParameters />}
        </div>
    );
};

export default TestRoomCreation;