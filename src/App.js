import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import SpaghettiIcon from "./assets/spaghetti.jpg";
import LasagneIcon from "./assets/lasagne.jpg"
import ChocolateCakeIcon from "./assets/chocolatecake.jpg"
import BananaBread from "./assets/banana_bread.jpg"
import TomatoSoup from "./assets/tomato-soup.jpg"
import Hamburger from "./assets/hamburger.webp"
import Listener from "./components/Listener";
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Button } from "react-bootstrap";
import NavbarComponent from "./components/Navbar";

const indices = [0 , 1, 2, 3, 4, 5]
const foodNames = ["Spaghetti", "Lasagne", "Chocolate Cake", "Banana Bread", "Tomato Soup", "Hamburger"]
const icons = [SpaghettiIcon, LasagneIcon, ChocolateCakeIcon, BananaBread, TomatoSoup, Hamburger]

function App() {
    return (
      <Container>
        <NavbarComponent/>
        <Row>
        <Col>
          <Listener/>
          </Col>
          <Col>
          <Card bg="warning" border="light">
            <Card.Header><Button style={{margin: "5px", visibility: "hidden"}}>Test</Button></Card.Header>
            <Card.Body>
              <Card.Title>Choose from recipes to add ingredients</Card.Title>
                <Card.Text>
                  <Row xs={2} md={3} className="g-4">
                      {indices.map((idx) => (
                        <Col>
                          <Card>
                          <Card.Header>
                              {foodNames[idx]}
                            </Card.Header>
                            <Card.Img variant="top" src={icons[idx]} />
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="outline-dark">Load more...</Button>
            </Card.Footer>
          </Card>
          </Col>
          </Row>
      </Container>
      
    );
  
}

export default App;