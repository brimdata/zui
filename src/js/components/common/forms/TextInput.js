/* @flow */
import React from "react"

export default function TextInput(props: *) {
  const type = props.type || "text"
  return <input {...props} type={type} className="text-input" />
}
