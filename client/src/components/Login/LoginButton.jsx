import { useState } from "react";
import UserCreationModal from "./UserCreationModal.jsx";
import ModalOpenConnection from "./ModalOpenConnection.jsx";

const LoginButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a className="waves-effect waves-light btn modal-trigger" href="#modalConnection"
               onClick={() => setModalOpen(true)}>
                Se connecter
            </a>
            {modalOpen && <ModalOpenConnection />}
        </>
    );
};

export default LoginButton;