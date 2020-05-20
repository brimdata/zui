/* @flow */
import React from "react"
import ReactDOM from "react-dom"

import lib from "../lib"

type Props = {children: *}

export default function InfoNotice({children}: Props) {
  return ReactDOM.createPortal(
    <div className="info-notice-wrapper">
      <div className="info-notice">{children}</div>
    </div>,
    lib.doc.id("tooltip-root")
  )
}
