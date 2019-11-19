/* @flow */

import React from "react"
import classNames from "classnames"

type Props = {checked: boolean, onChange: () => *, dataTestLocator: string}

export default class Toggle extends React.Component<Props> {
  render() {
    return (
      <div
        className={classNames("toggle", {checked: this.props.checked})}
        onClick={this.props.onChange}
        // Pass-through props didn't work here. I had to set this directly.
        // Feel free to improve.
        data-test-locator={this.props.dataTestLocator}
      >
        <div className="bar" />
        <div className="knob" />
      </div>
    )
  }
}
