import { Navbar, Container } from "react-bootstrap";
import Logo from "../assets/logo.png"
import SiProbot from "react-icons"
function NavbarComponent(){
    return (<>
        <Navbar style={{marginBottom: "10px", marginTop: "10px"}} bg="warning" variant="warning">
          <Container>
            <Navbar.Brand>
              <img
                alt=""
                src={Logo}
                width="50"
                height="50"
                className="d-inline-block align-top"
              />{' '}
            Voice-Based Grocery Planner
            </Navbar.Brand>
          </Container>
        </Navbar>
      </>);
}

export default NavbarComponent;