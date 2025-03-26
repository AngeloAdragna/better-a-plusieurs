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
