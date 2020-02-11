/* @flow */

import React from "react"

import CloseButton from "./CloseButton"

export default function ProgressIndicator() {
  return (
    <div className="progress-indicator">
      <div className="progress-track">
        <div className="progress-fill" />
      </div>
      <CloseButton />
    </div>
  )
}
