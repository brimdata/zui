import React from "react"

export function note(text: string) {
  return (
    <span key={text} className="zed-note">
      {text}
    </span>
  )
}
