import React, { useState, useEffect, useRef } from "react";
import ModalRoomParameters from "./ModalRoomParameters";
import M from "materialize-css";
import axios from "axios";

const ModalOpenConnection = ({ onlyConnection }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [submittedData, setSubmittedData] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            M.Modal.init(modalRef.current);
            M.updateTextFields();
            setTimeout(() => M.updateTextFields(), 100);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', formData);
            console.log("Login successful:", response.data);
            setSubmittedData(formData);
            onClose();

            if (!onlyConnection) {
                setTimeout(() => {
                    const roomModal = M.Modal.getInstance(document.getElementById("modalRoomParameters"));
                    if (roomModal) roomModal.open();
                }, 300);
            }

        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Erreur de connexion : " + (error.response?.data?.error || "Erreur inconnue"));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function onClose() {
        const instance = M.Modal.getInstance(modalRef.current);
        if (instance) {
            instance.close();
            console.log("Modal closed");
        }
    }

    return (
        <>
            {/* Premier Modal */}
            <div id="modalCreate" className="modal" ref={modalRef}>
                <div className="modal-content black-text">
                    <h5>Connexion</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="input-field black-text">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <label htmlFor="username">Nom d'utilisateur</label>
                        </div>
                        <div className="input-field black-text">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <label htmlFor="password">Mot de passe</label>
                        </div>

                        <button type="submit" className="btn waves-effect waves-light">
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>

            {/* Deuxième Modal */}
            <ModalRoomParameters />
        </>
    );
};

export default ModalOpenConnection;
