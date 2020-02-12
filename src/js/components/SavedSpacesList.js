/* @flow */
import React from "react"

export default function SavedSpacesList() {
  let spaces = [
    "Untitled-1",
    "md5 cap exercise",
    "corelight dataset",
    "CTF 2017",
    "Notice logs"
  ]
  return (
    <div className="saved-spaces-list">
      {spaces.map((s) => (
        <a onClick={() => {}} key={s} href="#">
          <span className="name">{s}</span>
          <div className="line" />
        </a>
      ))}
    </div>
  )
}
