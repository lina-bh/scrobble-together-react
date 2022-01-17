import React, { StrictMode } from "react"
import { render } from "react-dom"
// import reportWebVitals from "./reportWebVitals"

import "./tailwind.css"
import "./index.css"
import App from "./App"
import { AuthProvider } from "./AuthContext"

render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
  document.getElementById("root")
)

// reportWebVitals(console.log)
