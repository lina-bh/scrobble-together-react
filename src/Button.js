import React from "react"

const Button = (props) => {
  let colours = "hover:bg-slate-300"
  if (props.posture === "bad") {
    colours =
      "text-white bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
  } else if (props.posture === "good") {
    colours =
      "text-white bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
  }
  const classes =
    "inline-block py-1.5 px-3 rounded border-2 no-underline " + colours
  return props.href ? (
    <a className={classes} {...props}>
      {props.children}
    </a>
  ) : (
    <button className={classes} {...props}></button>
  )
}
export default Button
