import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import M from "materialize-css";
import { IoIosArrowForward } from "react-icons/io";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import '../styles/ChatBox.css';
import { IoIosSend } from "react-icons/io";

const socket = io("http://localhost:8080");
const gf = new GiphyFetch("Rg2Fql3Wpc2tKQUHOpUTKo0PdG80rmJX"); // TODO : move to env variable

const ChatBox = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showPicker, setEmojieShowPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const gifPickerRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messageListRef = useRef(null);

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => socket.off("message");
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            socket.emit("message", message);
            setMessage("");
        }
    };


    // Initialize Materialize
    useEffect(() => {
        const toolTypes = document.querySelectorAll(".tooltipped");
        M.Tooltip.init(toolTypes);
    } , []);

    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleLinkClick = () => {
        setIsCollapsed((prev) => !prev);
        const chatContainer = document.querySelector(".ChatContainer");
        if (chatContainer) {
            M.Collapsible.init(chatContainer, { accordion: false });
        }
    };

    // Close the gif picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
                setShowGifPicker(false);
            }
        };

        if (showGifPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showGifPicker]);

    // Close the emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setEmojieShowPicker(false);
            }
        };
        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPicker]);

    // Scroll to the bottom of the message list when a new message is added
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <section className={`ChatContainer ${isCollapsed ? 'collapsed' : ''} `}>
            <span onClick={handleLinkClick} className={`${isCollapsed ? 'rotate' : 'arrow'} tooltipped`}
                  data-position="left" data-tooltip={`${isCollapsed ? 'Open ChatBox' : 'Close ChatBox'}`}>
                <IoIosArrowForward />
            </span>

            <div className="ChatContent">
                <div className="ChatHeader">
                    <div className="MessageList" ref={messageListRef}>
                        {messages.map((msg, index) => {
                            const author = msg.author || "Anonyme";

                            const colorFromString = (str) => {
                                let hash = 0;
                                for (let i = 0; i < str.length; i++) {
                                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                                }
                                const hue = Math.abs(hash) % 360;
                                return `hsl(${hue}, 65%, 60%)`;
                            };

                            const authorColor = colorFromString(author);

                            return (
                                <div key={index} className="message">
                                    <span className="author" style={{ color: authorColor }}>
                                        {author} :
                                    </span>{" "}
                                    {(() => {
                                        const content = typeof msg === "string" ? msg : msg.text || "";

                                        if (typeof content === "string" && content.startsWith("http")) {
                                            return <img src={content} alt="gif" className={"gifChat"} />;
                                        }
                                        return <span className="text">{content}</span>;
                                    })()}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="ChatInputArea">
                    <button onClick={() => setEmojieShowPicker(!showPicker)} className="emoji-button">
                        <img src="/src/assets/emojiIcon.png" alt="Emoji" />
                    </button>

                    <button onClick={() => setShowGifPicker(!showGifPicker)} className="gif-button">
                        <img src="/src/assets/gifIcon.svg" alt="GIF" />
                    </button>

                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Message..."
                    />

                    <button onClick={handleSend} className={"sendMessageButton"}>
                        <IoIosSend />
                    </button>
                </div>

                {showPicker && (
                    <div className="emoji-picker-container" ref={emojiPickerRef}>
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji) => {
                                setMessage((msg) => msg + emoji.native);
                            }}
                        />
                    </div>
                )}


                {showGifPicker && (
                    <div ref={gifPickerRef} className="gif-picker-container">
                        <Grid
                            width={300}
                            columns={3}
                            fetchGifs={(offset) => gf.trending({ offset, limit: 9 })}
                            onGifClick={(gif, e) => {
                                e.preventDefault();
                                socket.emit("message", gif.images.fixed_height.url);
                                setShowGifPicker(false);
                            }}
                            noLink
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChatBox;
