import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import microPhoneIcon from "../assets/microphone.svg";
import removeIcon from "../assets/delete.svg";
import "../App.css";
import IngredientRow from "./IngredientRow";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import {Card, Button, Row, Col} from 'react-bootstrap';
import {BsTrashFill, BsMicFill} from 'react-icons/bs'

function cleanPunctuation(phrase){
    return phrase.replace(".", "")
}

function Listener() {
    const componentRef = useRef();
    let amountRegexp = new RegExp("[0-9]+")
    let units = ["kilogram", "gram", "millilitre", "litre", "pound", "ounce", "kg", "gr", "L", "ml"]
    const handlePrint = useReactToPrint({
      content: () => componentRef.current
    });
  
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
          command: "set *",
          callback: (phrase) => {
              phrase = cleanPunctuation(phrase)
                let toIndex = phrase.indexOf("to")
                if(toIndex != -1){
                    let spaceBeforeRemainingName = phrase.indexOf(" ", toIndex)
                    let name = phrase.substring(0, spaceBeforeRemainingName - 3)
                    let amount = phrase.substring(spaceBeforeRemainingName + 1, phrase.length)
                    setAmount(name, amount)
                
                }

          },
        },
        {
            command: "remove *",
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
                      decreaseElement(name, amountMatch)
                      setIngredientList(copyIngredientList)
                  } else{
                    deleteElement(phrase)
                  }
              })
              resetTranscript();
            },
        },
        {
          command: "double *",
          callback: (phrase) => {
            console.log("çalıştır")
            stopHandle()
            phrase = cleanPunctuation(phrase)
            doubleQuantities(phrase);
            resetTranscript();
            handleListing()
          },
      },
        {
            command: "I will cook *",
            callback: (phrase) => {
                stopHandle()
                phrase = cleanPunctuation(phrase)
                getRecipeWithName(phrase)
                resetTranscript()
                handleListing()
            },
        },
        {
            command: "abort *",
            callback: (phrase) => {
              resetTranscript()
            },
        },
        {
          command: "clear",
          callback: (phrase) => {
            stopHandle()
            setIngredientList([])
            resetTranscript()
            handleListing()
          },
      },
      {
        command: "to pdf",
        callback: (phrase) => {
          stopHandle()
          handlePrint()
          resetTranscript()
          handleListing()
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

    const doubleQuantities = (phrase) => {
      let newList = []
      setIngredientList([])
      ingredientList.forEach(e => {
        let eCopy = e
        if(phrase === "all" || (phrase !== "all" && phrase === e.name)){
          eCopy.amount = 2 * e.amount
        }
        newList.push(eCopy)
      })
      setIngredientList(newList)
    }
    const setAmount = (name, amount) => {
      let newList = []
      setIngredientList([])
      ingredientList.forEach(e => {
        let eCopy = e
        if(name === e.name){
          eCopy.amount = amount;
        }
        newList.push(eCopy)
      })
      setIngredientList(newList)
    }

    const decreaseElement = (name, amount) => {
      let newList = []
      setIngredientList([])
      ingredientList.forEach(e => {
        let eCopy = e
        if(name === e.name){
          eCopy.amount = e.amount - amount
          console.log("Amount: " + eCopy.amount)
          if(eCopy.amount !== "0")
            newList.push(eCopy)
        } else{
          newList.push(eCopy)
        }
        
      })
      setIngredientList(newList)
    }

    function getRecipeWithName(name){
        axios.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/comp537-nxhuf/service/new-endpoint/incoming_webhook/webhook0?arg1=" + name).then(response => {
            return response.data
        }).then(data => {
            let existingIngredients = ingredientList;
            // TODO: UNIT AND AMOUNT PARTS WILL BE CHANGED
            data.ingredients.replaceAll("]", '').replaceAll("[", "").replaceAll("'", "").split(",").map(e => e.trim()).forEach(ingredient => {
                existingIngredients.push({key: name, name: ingredient, unit: "kg", amount: "1"})
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
                 
      <div ref={componentRef} className="column">
        <Card bg="warning" border="light">
            <Card.Header>
            <Button style={{margin: "5px"}} ref={microphoneRef} variant="outline-dark" onClick={handleListing}><BsMicFill/></Button>
              {isListening && (
                <button className="microphone-stop btn" onClick={stopHandle}>
                  Stop
                </button>
              )}
            </Card.Header>
            <Card.Body>
              <Card.Title>{transcript && (
                  <div className="microphone-result-container">
                    <div className="microphone-result-text">{transcript}</div>
                    <button className="microphone-reset btn" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                )}
        </Card.Title>
                <Card.Text>

        {ingredientList && ingredientList.map(e => {
            return (
                <Row>
                    <Col xs={10}>
                      <IngredientRow key = {e.name} name={e.name} amount = {e.amount} unit = {e.unit}></IngredientRow>
                    </Col>
                    <Col xs={2}>
                      <Button style={{margin: "5px"}} variant="outline-dark" onClick={() => deleteElement(e.name)}><BsTrashFill/></Button>
                    </Col>    
                </Row>
            
            )
        })}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>

      
    );
  }
  export default Listener;