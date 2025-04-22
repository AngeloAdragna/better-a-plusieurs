import React, { useState, useEffect, useRef } from "react";
import ModalRoomParameters from "../RoomCreation/ModalRoomParameters";
import M from "materialize-css";
import axios from "axios";


const UserCreationModal = () => {
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [submittedData, setSubmittedData] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            M.Modal.init(modalRef.current);
            M.updateTextFields();
            setTimeout(() => M.updateTextFields(), 100);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // requête avec axios ou fetch pour envoyer les données au backend
        axios.post( 'http://localhost:8080' + '/users', formData)
            .then(response => {
                console.log("User created:", response.data);
                setSubmittedData(response.data);
                alert("Utilisateur créé avec succès !");
                onClose();
            })
            .catch(error => {
                console.error("Login failed:", error.response.data);
                alert("Erreur de connexion : " + error.response.data.error);
                onClose();
            });

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
                    <h5>Créer un utilisateur</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="input-field black-text">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <label htmlFor="name">Nom d'utilisateur</label>
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

export default UserCreationModal;
