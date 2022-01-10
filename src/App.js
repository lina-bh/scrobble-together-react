import Container from "react-bootstrap/Container"
import { lazy as reactLazy, Suspense } from "react"

import { useAuth } from "./AuthContext"
import Header from "./Header"
import Login from "./Login"

const Home = reactLazy(() => import("./Home"))

export default function App() {
  const auth = useAuth()

  return (
    <>
      <Header />
      <Container className="mt-4">
        <Suspense fallback={null}>{auth.key ? <Home /> : <Login />}</Suspense>
      </Container>
    </>
  )
}
