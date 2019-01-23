/* @flow */

import React from "react"
import Arrow from "../icons/caret-bottom-sm.svg"

export default class ThinPicker extends React.Component<{}> {
  render() {
    return (
      <button className="thin-button thin-picker" {...this.props}>
        <Arrow />
      </button>
    )
  }
}
