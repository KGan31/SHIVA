import React, { useRef, useState } from "react";
import { assets } from "../../assets/assets"; // Import your icon image
import {getWaveBlob} from "webm-to-wav-converter"
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AudioRecorder = ({ username, password, firstname, lastname, email }) => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [cookies, setCookie] = useCookies(['username'])
  const navigate = useNavigate();
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
            // console.log(state);
            console.log(firstname)
            data.append("username", username);
            data.append("password",password);
            data.append("fname", firstname);
            data.append("lname", lastname);
            data.append("email", email);
            data.append("audio", audiofile);
            chunks.current = [];
            console.log(data)
            const response = await fetch("http://127.0.0.1:5000/register", {
              method: "POST",
            //   headers: {
            //     'Content-type':'multipart/form-data'
            //   },
              body: data,
            });
            console.log(response.status)
            const res = await response.json()
            console.log(res)
            if(response.ok){
                setCookie('username', username, { path: '/' })
                navigate('/');
            }
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

function SignUpForm() {
  const [state, setState] = React.useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",

  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
    console.log(state)
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { name, email, password } = state;
    alert(
      `You are sign up with name: ${name} email: ${email} and password: ${password}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        {/* <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span> */}
        <input
          type="text"
          name="firstname"
          value={state.firstname}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastname"
          value={state.lastname}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
         <p >Please speak anything, like, "Hello Shiva, how are you!"</p>

         <AudioRecorder username={state.username}
            password={state.password}
            firstname={state.firstname}
            lastname={state.lastname}
            email={state.email}/>
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
