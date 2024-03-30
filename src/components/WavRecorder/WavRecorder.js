import React, { useRef, useState } from "react";
const { getWaveBlob } = require("webm-to-wav-converter");
const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
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
          const waveBlob = await getWaveBlob(recordedBlob, false); // Updated usage of getWaveBlob
          const audiofile = new File([waveBlob], "audiofile.wav", {
            type: "audio/wav",
          });
          // const audiofile = new File([bl], "audiofile.wav", {
          //   type: "audio/wav",
          // });
          const data = new FormData();
          data.append("username", "Testing8");
          data.append(
            "password",
            "this is the transcription of the audio file"
          );
          data.append("fname", "this is the transcription of the audio file");
          data.append("lname", "this is the transcription of the audio file");

          data.append("audio", audiofile);
          console.log(data.get("username"));
          const url = URL.createObjectURL(recordedBlob);
          setRecordedUrl(url);
          chunks.current = [];
          console.log("uploading...");

          fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            // headers: {
            //   'Content-type':'multipart/form-data'
            // },
            body: data,
          });
        } catch (error) {
          console.error("Error getting wave blob:", error);
        }
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  return (
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
export default AudioRecorder;
