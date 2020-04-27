/* @flow */
import React from "react"
import ReactDOM from "react-dom"

import XButton from "./XButton"
import lib from "../lib"

type Props = {|onClick: (number) => void|}

export default function InfoNotice({onClick}: Props) {
  return ReactDOM.createPortal(
    <div className="info-notice-wrapper">
      <div className="info-notice">
        More data is now available.
        <button className="bevel-button" onClick={() => onClick(0)}>
          Refresh
        </button>
        <XButton onClick={() => onClick(1)} />
      </div>
    </div>,
    lib.doc.id("tooltip-root")
  )
}
