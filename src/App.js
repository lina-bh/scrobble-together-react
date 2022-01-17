import React from "react"

import { useAuth } from "./AuthContext"
import Header from "./Header"
import Login from "./Login"
import Home from "./Home"

export default function App() {
  const auth = useAuth()

  return (
    <>
      <Header />
      <div className="mx-auto p-3 max-w-md">
        {auth.key ? <Home /> : <Login />}
      </div>
    </>
  )
}
