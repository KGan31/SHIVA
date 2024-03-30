import React, { useContext, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./main.css";
import { Context } from "../../context/Context";

const Main = () => {
    const {
        onSent,
        recentPrompt,
        loading,
        resultData,
        setInput,
        input,
    } = useContext(Context);

    const chatContainerRef = useRef(null);

    const handleCardClick = (promptText) => {
        setInput(promptText);
    };

    // Scroll the chat container to the bottom when the result data changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [resultData]);

    return (
        <div className="main">
            {/* Add a container for the login/signin button */}
            <div className="login-button-container">
                {/* Use Link component to navigate to /login */}
                <Link to="/login" className="login-button">Profile</Link>
            </div>
            <div className="main-container">
                <div className="chat-container" ref={chatContainerRef}>
                    <div className="message-container">
                        <div className="user-message chat-message">
                            <p>{recentPrompt}</p>
                        </div>
                        {loading ? (
                            <div className="loader">
                                <hr />
                                <hr />
                                <hr />
                            </div>
                        ) : (
                            <div
                                className="api-message chat-message"
                                dangerouslySetInnerHTML={{ __html: resultData }}
                            ></div>
                        )}
                    </div>
                </div>
                <div className="search-box">
                    <input
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        value={input}
                        type="text"
                        placeholder="Enter the Prompt Here"
                    />
                    <div style={{ position: "relative" }}>
                        <img src={assets.chat} alt="" style={{ marginRight: "10px" }} />
                        <img 
                            src={assets.send}
                            alt=""
                            style={{ marginRight: "10px" }}
                            onClick={() => {
                                onSent();
                            }}
                        />
                        <img src={assets.voice} alt="" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
                    </div>
                </div>
                <div className="bottom-info"></div>
            </div>
        </div>
    );
};

export default Main;

