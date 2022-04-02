import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import microPhoneIcon from "../assets/microphone.svg";
import removeIcon from "../assets/delete.svg";
import "../App.css";
import IngredientRow from "./IngredientRow";
import axios from "axios";

function cleanPunctuation(phrase){
    return phrase.replace(".", "")
}

function Listener() {
    let amountRegexp = new RegExp("[0-9]+")
    let units = ["kilogram", "gram", "millilitre", "litre", "pound", "ounce", "kg", "gr", "L", "ml"]
            
    const [ingredientList, setIngredientList] = useState([])

    const commands = [
        {
          command: "write *",
          callback: (phrase) => {
              phrase = cleanPunctuation(phrase)
            let amountMatch = amountRegexp.exec(phrase)
            units.forEach(e => {
                let unitIndex = phrase.indexOf(e)
                if(unitIndex != -1){
                    let spaceBeforeRemainingName = phrase.indexOf(" ", unitIndex)
                    let name = phrase.substring(spaceBeforeRemainingName + 1)
                    let copyIngredientList = ingredientList
                    if(copyIngredientList === undefined)
                        copyIngredientList = []
                    copyIngredientList.push({key: name, name: name, unit: e, amount: amountMatch})
                    setIngredientList(copyIngredientList)
                    resetTranscript();
                }
            }

            )


          },
        },
        {
            command: "remove *",
            callback: (phrase) => {
                phrase = cleanPunctuation(phrase)
              deleteElement(phrase)
              resetTranscript();
            },
        },
        {
            command: "I will cook *",
            callback: (phrase) => {
                phrase = cleanPunctuation(phrase)
                getRecipeWithName(phrase)
                resetTranscript()
            },
        },
        {
            command: "abort *",
            callback: (phrase) => {
              resetTranscript()
            },
        },
        

      ];
    

    const { transcript, resetTranscript } = useSpeechRecognition({commands});
    const [isListening, setIsListening] = useState(false);
    const microphoneRef = useRef(null);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return (
        <div className="mircophone-container">
          Browser is not Support Speech Recognition.
        </div>
      );
    }
    const handleListing = () => {
      setIsListening(true);
      microphoneRef.current.classList.add("listening");
      SpeechRecognition.startListening({
        continuous: true,
      });
    };

    const deleteElement = (name) => {
        let newList = []
        ingredientList.forEach(e => {
            if(e.name !== name)
                newList.push(e)
        })
        setIngredientList(newList)
    }

    function getRecipeWithName(name){
        axios.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/comp537-nxhuf/service/new-endpoint/incoming_webhook/webhook0?arg1=" + name).then(response => {
            return response.data
        }).then(data => {
            let existingIngredients = ingredientList;
            
            data.ingredients.replaceAll("]", '').replaceAll("[", "").replaceAll("'", "").split(",").map(e => e.trim()).forEach(ingredient => {
                existingIngredients.push({key: name, name: ingredient, unit: "", amount: ""})
            })
            setIngredientList(existingIngredients)
            stopHandle()
            handleListing()
        })
    }

    
    const stopHandle = () => {
      setIsListening(false);
      microphoneRef.current.classList.remove("listening");
      SpeechRecognition.stopListening();
    };
    const handleReset = () => {
      stopHandle();
      resetTranscript();
    };
    return (
      <div className="column">
        <div className="mircophone-container">
          <div
            className="microphone-icon-container"
            ref={microphoneRef}
            onClick={handleListing}
          >
            <img width={50} heigth={50} src={microPhoneIcon} className="microphone-icon" />
          </div>
          {isListening && (
            <button className="microphone-stop btn" onClick={stopHandle}>
              Stop
            </button>
          )}
        </div>
        {transcript && (
          <div className="microphone-result-container">
            <div className="microphone-result-text">{transcript}</div>
            <button className="microphone-reset btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}

        {ingredientList && ingredientList.map(e => {
            return (
                <div className="row">
                    <IngredientRow key = {e.name} name={e.name} amount = {e.amount} unit = {e.unit}></IngredientRow>
                    <img width={50} heigth={50} style={{margin: 10}} src={removeIcon} onClick={() => deleteElement(e.name)} className="delete-icon" />
                </div>
            
            )
        })}

      </div>

      
    );
  }
  export default Listener;