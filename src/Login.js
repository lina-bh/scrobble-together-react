import React, { useEffect, useState, useCallback } from "react"
import Button from "./Button"

import { authGetSession, authGetToken, LfmError } from "./api"
import { useAuth } from "./AuthContext"

const LOGIN_URL =
  "http://www.last.fm/api/auth/?api_key=f28fccb10bd142b6dc8eadded052dbb5"

export default function Login(props) {
  const auth = useAuth()
  const [token, setToken] = useState(null)

  const onFocus = useCallback(async () => {
    if (document.visibilityState === "hidden") {
      return
    }
    if (token) {
      try {
        const session = await authGetSession(token)
        auth.login(session)
      } catch (e) {
        if (!(e instanceof LfmError && e.code === 14)) {
          throw e
        }
      }
    }
  }, [token, auth])

  useEffect(() => {
    if (!token) {
      ;(async () => {
        setToken(await authGetToken())
      })()
    }
    window.addEventListener("visibilitychange", onFocus)
    return () => window.removeEventListener("visibilitychange", onFocus)
  }, [token, onFocus])

  return (
    <>
      <p>
        Scrobble Together listens for the scrobbles of another last.fm user and
        replicates them to your last.fm profile. Imagine you're in a music
        library or other kind of venue, or in the car listening together, and
        you want to add the songs you're both listening to on your last.fm:
        Scrobble Together is perfect for that. All you need to do is to log in
        with last.fm, and type in someone else's last.fm username.
      </p>
      <div className="pt-4 text-center">
        <Button
          posture="good"
          href={LOGIN_URL + "&token=" + token}
          target="_blank">
          Sign in with Last.fm
        </Button>
      </div>
    </>
  )
}
