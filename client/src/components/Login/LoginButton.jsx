import { useState } from "react";
import UserCreationModal from "./UserCreationModal.jsx";

const LoginButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a className="waves-effect waves-light btn modal-trigger" href="#modalCreate"
               onClick={() => setModalOpen(true)}>
                Créer un compte
            </a>
            {modalOpen && <UserCreationModal onlyConnection={true} />}
        </>
    );
};

export default LoginButton;