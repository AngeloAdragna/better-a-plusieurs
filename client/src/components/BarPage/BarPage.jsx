import ModalParametersUser from "./ModalParametersUser";
import ModalHelpUser from "./ModalHelpUser";
import ModalParametersUserRoom from "./ModalParametersUserRoom";
import ModalShareRoom from "./ModalShareRoom";
import React, { useState } from "react";
import YoutubeSearchBar from "../Youtube/YoutubeSearchBar.jsx";

const BarPage = ({roomName, roomId, socket, isAllowedToShare}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const isConnected = false; //TODO Remplace ça par un vrai état de connexion
    return (
        <section className='BarPage'>
            <div className='valign-wrapper'>
                <div className='col s3'>
                    <div className='item'>
                        <div className='valign-wrapper'>
                            <div className='col s6 valign-wrapper'>
                                <img src='/src/assets/icon_space.svg' alt='Icon Space' href='/' />
                            </div>
                            <div className='col s6 nameAppliBar'>Better à Plusieurs</div>
                        </div>
                    </div>
                </div>
                <div className='col s3'>
                    <div className='item center-align'>
                        <p className='roomNameBar'>
                            {roomName}
                        </p>
                    </div>
                </div>
                <div className='col s3'>

                    <YoutubeSearchBar roomId={roomId} socket={socket}/>
                </div>
                <div className='col s3'>
                    <div className='item'>
                        <div className='valign-wrapper iconBar'>
                            <div className='col s4'>
                                <a className="modal-trigger" href="#ModalParametersUser"
                                   onClick={() => setModalOpen(true)}>
                                    <img className="barIcons" src='/src/assets/icon_param.svg' alt='Icon Parameters'/>
                                </a>
                                {<ModalParametersUser/>}
                            </div>
                            <div className='col s4'>
                                <a className="modal-trigger" href="#ModalParametersUserRoom"
                                   onClick={() => setModalOpen(true)}>
                                    <img className="barIcons" src='/src/assets/icon_chat.svg'
                                         alt='Icon Chat Parameters'/>
                                </a>
                                {<ModalParametersUserRoom/>}
                            </div>
                            <div className='col s4'>
                                <a className="modal-trigger" href="#ModalHelpUser"
                                   onClick={() => setModalOpen(true)}>
                                    <img className="barIcons" src='/src/assets/icon_aide.svg' alt='Icon Aide'/>
                                </a>
                                {<ModalHelpUser/>}
                            </div>
                            {isAllowedToShare && (
                                <div className='col s4'>
                                    <a className="modal-trigger" href="#modalShareRoom"
                                       onClick={() => setModalOpen(true)}>
                                        <img className="barIcons" src='/src/assets/share.png'
                                             alt='Icon share Parameters'/>
                                    </a>
                                    <ModalShareRoom />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BarPage;
