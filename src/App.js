import "./App.css";
import { lazy, Suspense } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { useAuth } from "./AuthContext";

const LogoutLink = lazy(() => import("./LogoutLink"));
const Login = lazy(() => import("./Login"));
const Home = lazy(() => import("./Home"));

const App = () => {
  const auth = useAuth();
  return (
    <>
      <Navbar className="navbar-bar-red">
        <Container>
          <Navbar.Brand>Scrobble Together</Navbar.Brand>
          <Suspense fallback={null}>
            {auth.key && (
              <Nav className="ml-auto">
                <LogoutLink />
              </Nav>
            )}
          </Suspense>
        </Container>
      </Navbar>
      <Container className="mt-4 mb-4">
        <Suspense fallback={null}>{auth.key ? <Home /> : <Login />}</Suspense>
      </Container>
    </>
  );
};

export default App;
