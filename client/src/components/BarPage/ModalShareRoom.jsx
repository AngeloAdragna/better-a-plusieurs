import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import M from "materialize-css";
import { QRCodeSVG } from 'qrcode.react';

const ModalShareRoom = () => {
    const location = useLocation();
    const [url, setUrl] = useState("");

    useEffect(() => {
        const elem = document.getElementById("modalShareRoom");
        if (elem) {
            M.Modal.init(elem);
        }

        const fullUrl = window.location.origin + location.pathname;
        setUrl(fullUrl);
    }, [location]);

    return (
        <div id="modalShareRoom" className="modal card-panel z-depth-1">
            <div className="modal-content">
                <h5 className="center-align">Partager cette room</h5>

                <div>
                    <div className="row">
                        <div className="col s12 m5 center-align">
                            <div className="qr-code-container" style={{ backgroundColor: "white", borderRadius: "12px", padding: "10px", display: "inline-block" }}>
                                <QRCodeSVG value={url} size={200} />
                            </div>
                        </div>

                        <div className="col s12 m7">
                            <div>
                                <p style={{ fontWeight: "bold" }}>Partage le lien :</p>
                                <div className="input-field">
                                    <input
                                        type="text"
                                        readOnly
                                        value={url}
                                        onClick={(e) => e.target.select()}
                                        className="browser-default"
                                        style={{
                                            borderRadius: "8px",
                                            padding: "8px",
                                            width: "100%",
                                            backgroundColor: "#f1f1f1",
                                            color: "#333",
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalShareRoom;
