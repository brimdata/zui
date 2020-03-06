/* @flow */

import React from "react"

import PacketPostProgress from "./PacketPostProgress"

export default function StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-bar-bg" />
      <div className="status-bar-content">
        <PacketPostProgress />
      </div>
    </div>
  )
}
