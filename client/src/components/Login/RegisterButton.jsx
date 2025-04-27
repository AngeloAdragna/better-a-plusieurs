import { useState } from "react";
import UserCreationModal from "./UserCreationModal.jsx";

const Register = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a className="waves-effect waves-light btn modal-trigger" href="#modalUserCreation"
               onClick={() => setModalOpen(true)}>
                Créer un compte
            </a>
            {modalOpen && <UserCreationModal/>}
        </>
    );
};

export default Register;