import { useState } from "react";
import UserCreationModal from "./UserCreationModal.jsx";

const Register = ({socket}) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a className="btnHover modal-trigger" href="#modalUserCreation"
               onClick={() => setModalOpen(true)}>
                Créer un compte
            </a>
            {modalOpen && <UserCreationModal socket={socket}/>}
        </>
    );
};

export default Register;
