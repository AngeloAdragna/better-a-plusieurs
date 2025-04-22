import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import M from "materialize-css";
import { IoIosArrowForward, IoIosSend } from "react-icons/io";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import "../styles/ChatBox.css";

const socket = io("http://localhost:8080");
const gf = new GiphyFetch("Rg2Fql3Wpc2tKQUHOpUTKo0PdG80rmJX"); // TODO: move to .env

const ChatBox = ({roomId}) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const gifPickerRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messageListRef = useRef(null);

    const username = localStorage.getItem("username") || "Anonyme";

    useEffect(() => {
        socket.on("message", (data) => setMessages((prev) => [...prev, data]));
        return () => socket.off("message");
    }, []);

    useEffect(() => {
        M.Tooltip.init(document.querySelectorAll(".tooltipped"));
    }, []);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
                setShowGifPicker(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        if (showGifPicker || showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showGifPicker, showPicker]);

    const handleSend = () => {
        if (message.trim()) {
            socket.emit("message", { roomId, author: username, data: message});
            setMessage("");
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
        M.Collapsible.init(document.querySelector(".ChatContainer"), { accordion: false });
    };

    const colorFromString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 65%, 60%)`;
    };

    useEffect(() => {
        if (roomId) {
            socket.emit("joinRoom", roomId);
        }
    }, [roomId]);


    return (
        <section className={`ChatContainer ${isCollapsed ? "collapsed" : ""}`}>
      <span
          onClick={toggleCollapse}
          className={`${isCollapsed ? "rotate" : "arrow"} tooltipped`}
          data-position="left"
          data-tooltip={`${isCollapsed ? "Open ChatBox" : "Close ChatBox"}`}
      >
        <IoIosArrowForward />
      </span>

            <div className="ChatContent">
                <div className="ChatHeader">
                    <div className="MessageList" ref={messageListRef}>
                        {messages.map((msg, index) => {
                            const author = msg.author || "Anonyme";
                            const content = typeof msg === "string" ? msg : msg.text || "";
                            const isGif = typeof content === "string" && content.startsWith("http");
                            const isBigEmoji = /^[^\w\s]{1,4}$/u.test(content);
                            const authorColor = colorFromString(author);

                            return (
                                <div key={index} className="message">
                                    <span className="author" style={{ color: authorColor }}>{author} :</span>{" "}
                                    {isGif ? (
                                        <img src={content} alt="gif" className="gifChat" />
                                    ) : (
                                        <span className={`text ${isBigEmoji ? "big-emoji" : ""}`}>{content}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="ChatInputArea">
                    <button onClick={() => setShowPicker(!showPicker)} className="emoji-button">
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

                    <button onClick={handleSend} className="sendMessageButton">
                        <IoIosSend />
                    </button>
                </div>

                {showPicker && (
                    <div className="emoji-picker-container" ref={emojiPickerRef}>
                        <Picker data={data} onEmojiSelect={(emoji) => setMessage((msg) => msg + emoji.native)} />
                    </div>
                )}

                {showGifPicker && (
                    <div className="gif-picker-container" ref={gifPickerRef}>
                        <Grid
                            width={300}
                            columns={3}
                            fetchGifs={(offset) => gf.trending({ offset, limit: 9 })}
                            onGifClick={(gif, e) => {
                                e.preventDefault();
                                socket.emit("message", { roomId, author: username,  data: gif.images.fixed_height.url });
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
