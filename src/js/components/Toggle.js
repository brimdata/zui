/* @flow */

import React from "react"
import classNames from "classnames"

type Props = {checked: boolean, onChange: () => *}

export default class Toggle extends React.Component<Props> {
  render() {
    return (
      <div
        className={classNames("toggle", {checked: this.props.checked})}
        onClick={this.props.onChange}
        // Pass-through props didn't work here. I had to set this directly.
        // Feel free to improve.
        {...this.props}
      >
        <div className="bar" />
        <div className="knob" />
      </div>
    )
  }
}
