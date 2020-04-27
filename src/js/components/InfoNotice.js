/* @flow */
import React from "react"
import ReactDOM from "react-dom"

import XButton from "./XButton"
import lib from "../lib"

export default function InfoNotice() {
  return ReactDOM.createPortal(
    <div className="info-notice-wrapper">
      <div className="info-notice">
        More data is now available.
        <button className="bevel-button">Refresh</button>
        <XButton />
      </div>
    </div>,
    lib.doc.id("tooltip-root")
  )
}
