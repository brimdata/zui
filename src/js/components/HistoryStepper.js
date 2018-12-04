/* @flow */

import React from "react"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"

type Props = {}

export default class HistoryStepper extends React.Component<Props> {
  back() {}

  forward() {}

  render() {
    return (
      <div className="history-stepper">
        <button className="panel-button" onClick={this.back}>
          <Back />
        </button>
        <button className="panel-button" onClick={this.forward}>
          <Forward />
        </button>
      </div>
    )
  }
}
