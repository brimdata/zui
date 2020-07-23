/* @flow */

import React from "react"
import classNames from "classnames"

type Props = {checked: boolean, onChange: Function}

export default class Toggle extends React.Component<Props> {
  render() {
    return (
      <div
        {...this.props}
        className={classNames("toggle", {checked: this.props.checked})}
        onClick={this.props.onChange}
      >
        <div className="bar" />
        <div className="knob" />
      </div>
    )
  }
}
