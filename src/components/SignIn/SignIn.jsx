import React, { useRef, useState } from "react";
import { assets } from "../../assets/assets"; // Import your icon image
import {getWaveBlob} from "webm-to-wav-converter"



const AudioRecorder = ({ setUsername }) => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

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
            chunks.current = [];

            const response = await fetch("http://127.0.0.1:5000/login1", {
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
        src={isRecording ? assets.microphone : assets.mic2} // Use appropriate icons based on recording state
        alt={isRecording ? "Stop Recording" : "Start Recording"}
        className="mic-icon"
        onClick={toggleRecording}
        style={{cursor: 'pointer'}}
      />
    </div>
  );
};

function SignInForm() {
  
  const [state, setState] = React.useState({
    username: "",
    password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async(evt) => {
    evt.preventDefault();

    const { username, password } = state;
    // alert(`You are login with username: ${username} and password: ${password}`);
    // data.append("password", password);
    // data.append("username", username)
    const response = await fetch("http://127.0.0.1:5000/login2", {
      method: "POST",
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({username, password}),
    });
    if(response.ok){
      navigate('/');
    }
    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };
  const setUsername = (newUsername) => {
    setState((prevState) => ({
      ...prevState,
      username: newUsername
    }));
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <input
          type="username"
          placeholder="Username"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <div className="divider">
          <span className="divider-text">---- OR ----</span>
        </div>
        <p >Please speak anything, like, "Hello Shiva, how are you!"</p>
        {/* Add icon image here */}
      
        <AudioRecorder setUsername={setUsername}/>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
