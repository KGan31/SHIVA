import React, { useContext,useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./main.css";
import { Context } from "../../context/Context";
import { useCookies } from 'react-cookie';
import {getWaveBlob} from "webm-to-wav-converter"

const AudioRecorder = () => {
    const [recordedUrl, setRecordedUrl] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const mediaStream = useRef(null);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);
    const [cookies, setCookie] = useCookies(['username']);
    const toggleRecording = async () => {
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStream.current = stream;
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.current.push(e.data);
            }
          };
          mediaRecorder.current.onstop = async () => {
            try {
              const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
              const url = URL.createObjectURL(recordedBlob);
              setRecordedUrl(url);
              const waveBlob = await getWaveBlob(recordedBlob, false); // Updated usage of getWaveBlob
              const audiofile = new File([waveBlob], "audiofile.wav", {
                type: "audio/wav",
              });
              
              
              const data = new FormData();
              data.append("audio", audiofile);
              data.append("username", cookies.username)
              data.append("session_id", 1)
              chunks.current = [];
              console.log(data);
              const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                // headers: {
                //   'Content-type':'multipart/form-data'
                // },
                body: data,
              });
              console.log(response.status)
              const res = await response.json()
              setUsername(res['username'])
            } catch (error) {
              console.error("Error getting wave blob:", error);
            }
          };
          mediaRecorder.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      } else {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
          mediaRecorder.current.stop();
        }
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
        setIsRecording(false);
      }
    };
  
    return (
      <div>
        {/* <audio controls src={recordedUrl} /> */}
        <img
          src={isRecording ? assets.voice : assets.mic2} // Use appropriate icons based on recording state
          alt={isRecording ? "Stop Recording" : "Start Recording"}
          className="mic-icon"
          onClick={toggleRecording}
          style={{cursor: 'pointer'}}
        />
      </div>
    );
  };


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
                        <AudioRecorder/>
                    </div>
                </div>
                <div className="bottom-info"></div>
            </div>
        </div>
    );
};

export default Main;

