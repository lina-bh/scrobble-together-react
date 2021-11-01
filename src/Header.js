import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

import { useAuth } from "./AuthContext"
import LogoutLink from "./LogoutLink"

export default function Header() {
  const auth = useAuth()

  return (
    <Navbar className="navbar-bar-red">
      <Container>
        <Navbar.Brand>Scrobble Together</Navbar.Brand>
        {auth.key && (
          <Nav className="ml-auto">
            <LogoutLink />
          </Nav>
        )}
      </Container>
    </Navbar>
  )
}
