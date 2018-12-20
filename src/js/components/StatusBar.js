/* @flow */

import React from "react"
import XSearchStats from "../connectors/XSearchStats"
type Props = {}

export default class StatusBar extends React.Component<Props> {
  render() {
    return (
      <div className="status-bar">
        <div className="loading-animation">
          <div className="ring-1" />
          <div className="ring-2" />
        </div>
        <XSearchStats />
      </div>
    )
  }
}
