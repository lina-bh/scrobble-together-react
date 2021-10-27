import "./App.css"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import { useAuth } from "./AuthContext"
import LogoutLink from "./LogoutLink"
import Login from "./Login"
import Home from "./Home"
import ErrorBoundary from "./ErrorBoundary"

const Header = () => {
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

const App = () => {
  const auth = useAuth()
  return (
    <>
      <Header />
      <Container className="mt-4 mb-4">
        <ErrorBoundary>{auth.key ? <Home /> : <Login />}</ErrorBoundary>
      </Container>
    </>
  )
}

export default App
