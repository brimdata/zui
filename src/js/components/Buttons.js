/* @flow */

import * as React from "react"
import Arrow from "../icons/caret-bottom-sm.svg"
import * as MenuStyler from "../lib/MenuStyler"
import {ContextMenu} from "./ContextMenu"

type Children = {
  children: ?React.Node
}

export const ButtonGroup = ({children}: Children) => (
  <div className="button-group">{children}</div>
)

export const ThinButton = ({children}: Children) => (
  <button className="thin-button">{children}</button>
)

type Props = {children: React.Node}
type State = {isOpen: boolean, style: Object}

export class ThinPicker extends React.Component<Props, State> {
  open: Function
  close: Function

  constructor(props: Props) {
    super(props)
    this.state = {isOpen: false, style: {}}
    this.open = e =>
      this.setState({
        isOpen: true,
        style: MenuStyler.belowRight(e.currentTarget)
      })
    this.close = e => {
      e.stopPropagation()
      this.setState({isOpen: false})
    }
  }

  render() {
    return (
      <button className="thin-button thin-picker" onClick={this.open}>
        <Arrow />
        {this.state.isOpen && (
          <ContextMenu style={this.state.style} onOutsideClick={this.close}>
            {this.props.children}
          </ContextMenu>
        )}
      </button>
    )
  }
}
