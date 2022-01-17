import React, { useState } from "react"

import { GET, LfmError } from "./api/index"
import { userGetInfo, UserInfo } from "./api/user/getInfo"
import Follower from "./Follower"
import Alert from "./Alert"

const SAVEDUSER_KEY = "savedUser"

const UsernameBox = ({ onSubmit }) => {
  const [value, setValue] = useState("")

  const doChange = (ev) => {
    setValue(ev.target.value)
  }

  const doSubmit = (ev) => {
    onSubmit(value)
    ev.preventDefault()
  }

  return (
    <form className="flex" onSubmit={doSubmit}>
      <input
        className={`flex-grow min-w-0 p-2 border-l-2 border-y-2 rounded-l focus:outline-none focus:border-blue-400`}
        type="text"
        placeholder="Last.fm username"
        onChange={doChange}
      />
      <button
        className="px-3 border-r-2 border-y-2 rounded-r text-white border-green-500 bg-green-500"
        type="submit">
        Start
      </button>
    </form>
  )
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [invalidUser, setInvalidUser] = useState<string>("")

  const doSubmit = async (username: string, auto?: boolean) => {
    try {
      const { user } = await GET("user.getinfo", { user: username })
      console.log(user)
      setInvalidUser("")
      setUser(user)
      sessionStorage.setItem(SAVEDUSER_KEY, user.name)
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
    <>
      <div className="flex">
        <span className="flex-grow">
          {user.image[0]["#text"] !== "" && (
            <img
              className="inline-block"
              src={user.image[0]["#text"]}
              alt={user.name}
            />
          )}
          {user.name}
        </span>

        <button onClick={doClear}>Cease</button>
      </div>
      <Follower target={user} />
    </>
  ) : (
    <>
      <p>
        Enter someone's Last.fm username and Scrobble Together will start
        tracking their scrobbles.
      </p>
      <div className="py-3">
        <UsernameBox onSubmit={doSubmit} />
      </div>
      {invalidUser && (
        <Alert level="warning">User '{invalidUser}' not found.</Alert>
      )}
    </>
  )
}
