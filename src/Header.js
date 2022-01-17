import React, { useEffect, useState } from "react"

import { useAuth } from "./AuthContext"
import Button from "./Button"

const LogoutModal = ({ show, onConfirm, onClose }) => {
  const [opacity, setOpacity] = useState(0.0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      setOpacity(1.0)
    } else {
      setOpacity(0.0)
    }
  }, [show])

  return (
    <div
      style={{
        display: visible || show ? undefined : "none",
        opacity,
      }}
      className={`fixed z-10 inset-0 h-full w-full px-3 \
      flex flex-col justify-center items-center \
      transition-opacity duration-300`}
      onTransitionEnd={() => {
        if (!show) {
          setVisible(false)
        }
      }}>
      <div
        className="absolute z-20 inset-0 h-full w-full bg-black bg-opacity-50"
        onClick={onClose}></div>
      <div className="z-30 rounded w-fit px-3 py-2.5 bg-white text-black">
        <h2 className="text-2xl pt-1">Log out</h2>
        <p className="py-2">
          Are you sure you want to log your last.fm account out?
        </p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button posture="bad" onClick={onConfirm}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const auth = useAuth()
  const [show, setShow] = useState(false)

  const logout = () => {
    auth.logout()
    window.location.reload()
  }

  return (
    <div className="flex justify-between py-3 px-4 bg-black text-slate-300">
      <h1 className="inline m-0 text-xl font-medium text-red-500 cursor-default">
        Scrobble Together
      </h1>
      {auth.key && (
        <>
          <button
            className="inline-block text-md"
            onClick={() => setShow(true)}>
            Log out
          </button>
          <LogoutModal
            show={show}
            onClose={() => setShow(false)}
            onConfirm={logout}
          />
        </>
      )}
    </div>
  )
}
