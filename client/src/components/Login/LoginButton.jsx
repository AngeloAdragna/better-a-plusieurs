import { useState } from "react";
import LoginModal from "./LoginModal.jsx";

const LoginButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <a className="waves-effect waves-light btn modal-trigger" onClick={() => setModalOpen(true)}>
                Ouvrir le Modal de login
            </a>

            {modalOpen && <LoginModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} />}
        </div>
    );
};

export default LoginButton;