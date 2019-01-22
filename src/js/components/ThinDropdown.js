/* @flow */
import React from "react"
import * as MenuStyler from "../lib/MenuStyler"
import {ThinButton} from "./Buttons"
import ThinPicker from "./ThinPicker"
import Portal from "./Portal"

type State = {
  isOpen: boolean,
  style: Object
}

type Props = {
  value: string,
  align: string,
  portalClassName?: string,
  children: *
}

export default class ThinDropdown extends React.Component<Props, State> {
  open: Function
  close: Function

  constructor(props: Props) {
    super(props)
    this.state = {isOpen: false, style: {}}
    this.open = e => this.setState({isOpen: true, style: this.getStyle(e)})
    this.close = e => {
      e.stopPropagation()
      this.setState({isOpen: false})
    }
  }

  getStyle(e: MouseEvent) {
    switch (this.props.align) {
      case "left":
        return MenuStyler.belowLeft(e.currentTarget)
      case "right":
        return MenuStyler.belowRight(e.currentTarget)
    }
  }

  render() {
    return (
      <div className="thin-dropdown">
        <ThinButton onClick={this.open}>{this.props.value}</ThinButton>
        <ThinPicker onClick={this.open} />
        <Portal
          className={this.props.portalClassName}
          style={{...this.state.style, height: 500}}
          isOpen={this.state.isOpen}
          onClose={this.close}
        >
          {this.props.children}
        </Portal>
      </div>
    )
  }
}
