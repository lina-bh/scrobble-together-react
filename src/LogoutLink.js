import { useAuth } from "./AuthContext";
import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LogoutLink = () => {
  const auth = useAuth();
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    auth.logout();
    window.location.reload();
  };

  return (
    <>
      <Nav.Item>
        <Nav.Link onClick={() => setShowModal(true)}>
          Log out {auth.name}
        </Nav.Link>
      </Nav.Item>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log your Last.fm account out of Scrobble
          Together?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={logout}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LogoutLink;
