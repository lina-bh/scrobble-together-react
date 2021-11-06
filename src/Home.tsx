import { useState } from "react"
import Alert from "react-bootstrap/Alert"

import { LfmError } from "./api/index"
import { userGetInfo, UserInfo } from "./api/user/getInfo"
import TargetController from "./TargetController"
import UsernameBox from "./UsernameBox"

const SAVEDUSER_KEY = "savedUser"

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [invalidUser, setInvalidUser] = useState<string>("")

  const doSubmit = async (username: string, auto?: boolean) => {
    try {
      const userInfo = await userGetInfo(username)
      console.log(userInfo)
      setInvalidUser("")
      setUser(userInfo)
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
    setUser(null)
  }

  return user ? (
    <TargetController target={user} onClear={doClear} />
  ) : (
    <>
      <p>
        Enter someone's Last.fm username and Scrobble Together will start
        tracking their scrobbles.
      </p>
      <UsernameBox onSubmit={doSubmit} />
      {invalidUser && (
        <Alert variant="warning" className="mt-3 mx-5">
          User '{invalidUser}' not found.
        </Alert>
      )}
    </>
  )
}
