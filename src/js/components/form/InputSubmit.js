/* @flow */
import React from "react"

export default function InputSubmit({...inputProps}: Object) {
  return (
    <div className="input-submit">
      <input type="submit" {...inputProps} />
    </div>
  )
}
