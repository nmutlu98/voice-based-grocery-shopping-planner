import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import microPhoneIcon from "./assets/microphone.svg";
import Listener from "./components/Listener";

function App() {
    return (
      <div className="row">
          <Listener/>
          <div className="column">
            Deneme
          </div>
      </div>
      
    );
  
}

export default App;