import { useState, /* useEffect, */ useRef } from "react"
import FormControl from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import { userGetInfo, LfmError } from "./api"
import ScrobsView from "./ScrobsView"

function TrackBox({ onSubmit }) {
  const input = useRef(null)

  const enter = () => {
    onSubmit(input.current.value)
  }

  return (
    <InputGroup className="mx-auto px-5">
      <FormControl
        type="text"
        placeholder="Last.fm username"
        ref={input}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            enter()
          }
        }}
      />
      <Button onClick={enter}>Start</Button>
    </InputGroup>
  )
}

const SAVEDUSER_KEY = "savedUser"

export default function Home() {
  const [trackingUser, setTrackingUser] = useState(null)
  const [invalidUser, setInvalidUser] = useState(null)

  const doSubmit = async (username: string, auto: boolean) => {
    try {
      const userInfo = await userGetInfo(username)
      console.log(userInfo)
      setTrackingUser(userInfo)
      sessionStorage.setItem(SAVEDUSER_KEY, userInfo.name)
    } catch (ex) {
      if (ex instanceof LfmError && ex.code === 6) {
        if (auto) {
          sessionStorage.removeItem(SAVEDUSER_KEY)
        } else {
          setInvalidUser(username)
        }
      }
    }
  }

  const doClear = () => {
    sessionStorage.removeItem("savedUser")
    setTrackingUser(null)
  }

  /*
  useEffect(() => {
    let savedUser
    if ((savedUser = sessionStorage.getItem("savedUser"))) {
      doSubmit(savedUser, true)
    }
  }, [])
  */

  return trackingUser ? (
    <ScrobsView user={trackingUser} onClear={doClear} />
  ) : (
    <>
      <p>
        Enter someone's Last.fm username and Scrobble Together will start
        tracking their scrobbles.
      </p>
      <TrackBox onSubmit={doSubmit} />
      {invalidUser && (
        <Alert variant="warning" className="mt-3 mx-5">
          User '{invalidUser}' not found.
        </Alert>
      )}
    </>
  )
}
