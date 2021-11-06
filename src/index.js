import { StrictMode } from "react"
import { render } from "react-dom"
import "bootstrap/dist/css/bootstrap.min.css"
// import reportWebVitals from "./reportWebVitals"

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
