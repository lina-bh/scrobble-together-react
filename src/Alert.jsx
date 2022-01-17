import React from "react"

const Alert = (props) => {
  let colours = "text-white bg-blue-500"
  if (props.level === "warning") {
    colours = "bg-yellow-400"
  }
  return <div className={"p-2.5 rounded " + colours}>{props.children}</div>
}

export default Alert
