/* @flow */

import React from "react"
import X from "../icons/x-md.svg"

type Props = {
  filter: string,
  focused?: boolean,
  pending?: boolean,
  onClick?: Function,
  onRemoveClick?: Function
}

export default class FilterNode extends React.PureComponent<Props> {
  render() {
    const classNames = ["filter-node"]
    if (this.props.focused) classNames.push("focused")

    if (this.props.pending) classNames.push("pending")

    return (
      <div className={classNames.join(" ")} onClick={this.props.onClick}>
        <p>{this.props.filter}</p>
        {this.props.onRemoveClick && (
          <button className="remove-button" onClick={this.props.onRemoveClick}>
            <X />
          </button>
        )}
      </div>
    )
  }
}
