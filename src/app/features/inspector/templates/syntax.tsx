import React from "react"

export function syntax(text: string) {
  return (
    <span key={text} className="zed-syntax">
      {text}
    </span>
  )
}
