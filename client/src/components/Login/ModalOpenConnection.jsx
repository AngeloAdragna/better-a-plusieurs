import React, { useState, useEffect, useRef } from "react";
import ModalRoomParameters from "../RoomCreation/ModalRoomParameters.jsx";
import M from "materialize-css";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext.jsx";


const ModalOpenConnection = ({socket}) => {
    const { isConnected, setIsConnected } = React.useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [submittedData, setSubmittedData] = useState(null);
    const modalRef = useRef(null);
    const serverIP = import.meta.env.VITE_SERVER_IP;

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
        axios.post( `http://${serverIP}:8080` + '/login', formData)
            .then(response => {
                const token = response.data;
                console.log("Token received:", token);
                localStorage.setItem('token', token);
                console.log("Login successful:", response.data);
                setSubmittedData(formData);
                setIsConnected(true);
                localStorage.setItem("username", formData.username);
                socket.emit("userConnected", formData.username);
                window.location.reload();
            })
            .catch(error => {
                console.error("Login failed:", error.response.data);
                alert("Erreur de connexion : " + error.response.data.error);
            })
        onClose();
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
            <div id="modalConnection" className="modal" ref={modalRef}>
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

            <ModalRoomParameters/>
        </>
    );
};

export default ModalOpenConnection;
