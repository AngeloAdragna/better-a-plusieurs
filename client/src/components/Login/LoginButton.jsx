import { useState } from "react";
import UserCreationModal from "./UserCreationModal.jsx";
import ModalOpenConnection from "./ModalOpenConnection.jsx";

const LoginButton = ({socket}) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a id="btn_login" className="modal-trigger btnHover" href="#modalConnection"
               onClick={() => setModalOpen(true)}>
                Se connecter
            </a>
            {modalOpen && <ModalOpenConnection socket={socket} />}
        </>
    );
};

export default LoginButton;
