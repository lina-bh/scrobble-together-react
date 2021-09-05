import "./App.css";
import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormText from "react-bootstrap/FormText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLastfm } from "@fortawesome/free-brands-svg-icons";
// import { BrowserRouter as Router } from "react-router-dom";

const loginurl =
  "http://www.last.fm/api/auth/?api_key=f28fccb10bd142b6dc8eadded052dbb5&cb=https://epicbaby.neocities.org/stcallback.html";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authed: false };
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Navbar className="navbar-bar-red">
          <Container>
            <Navbar.Brand>Scrobble Together</Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="mt-4 mb-4">
          {!this.state.authed ? <Landing /> : <Authed />}
        </Container>
      </>
    );
  }
}

function Landing() {
  return (
    <>
      <div className="mb-2">
        <p>
          Scrobble Together listens for the scrobbles of another last.fm user
          and replicates them to your last.fm profile. Imagine you're in a music
          library or other kind of venue, or in the car listening together, and
          you want to add the songs you're both listening to on your last.fm:
          Scrobble Together is perfect for that. All you need to do is to log in
          with last.fm, and type in someone else's last.fm username.
        </p>
        <Button href={loginurl} target="_blank">
          <FontAwesomeIcon icon={faLastfm} /> Sign in with Last.fm
        </Button>
      </div>
    </>
  );
}

function Authed() {
  return <p>logged in</p>;
}
