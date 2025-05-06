import ModalParametersUser from "./ModalParametersUser";
import ModalHelpUser from "./ModalHelpUser";
import ModalShareRoom from "./ModalShareRoom";
import React, { useState } from "react";
import YoutubeSearchBar from "../Youtube/YoutubeSearchBar.jsx";
import { FaCogs } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { BsPatchQuestion } from "react-icons/bs";


const BarPage = ({roomName, roomId, socket, isAllowedToShare, isAllowedToAdd}) => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <section className='BarPage valign-wrapper'>
                <div className='col s4'>
                    <div className='item'>
                        <div className='valign-wrapper'>
                            <div className='col s4 valign-wrapper'>
                                <img 
                                    src='/src/assets/icon_space.svg' 
                                    alt='Icon Space' 
                                    href='/' 
                                    style={{ maxWidth: "100%", height: "auto" }} 
                                />
                            </div>
                            <div className='col s8 nameAppliBar'> {roomName}</div>
                        </div>
                    </div>
                </div>
                <div className='col s5'>
                    <YoutubeSearchBar roomId={roomId} socket={socket} isAllowedToAdd={isAllowedToAdd}/>
                </div>
                <div className='col s3 item'>
                    <div className='valign-wrapper iconBar'>
                        <div className='col s4'>
                            <a className="modal-trigger" href="#ModalParametersUser"
                                onClick={() => setModalOpen(true)}>
                                 <FaCogs className="barIcons" />
                            </a>
                            {<ModalParametersUser/>}
                        </div>
                        {isAllowedToShare && (
                            <div className='col s4'>
                                <a className="modal-trigger" href="#modalShareRoom"
                                    onClick={() => setModalOpen(true)}>
                                    <GoShareAndroid className="barIcons" />
                                </a>
                                <ModalShareRoom />
                            </div>
                        )}
                        <div className='col s4'>
                            <a className="modal-trigger " href="#ModalHelpUser"
                                onClick={() => setModalOpen(true)}>
                                <BsPatchQuestion className="barIcons" />
                            </a>
                            {<ModalHelpUser/>}
                        </div>
                        
                    </div>
                </div>
   
        </section>
    );
}

export default BarPage;
