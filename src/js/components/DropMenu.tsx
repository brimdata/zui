import React from "react"
import Portal from "./Portal"
import DimPortal from "./DimPortal"
import * as MenuStyler from "../lib/MenuStyler"

type State = {
  isOpen: boolean
  style: Object
}

type Props = {
  position: string
  className?: string
  children: any
  dim?: boolean
  onChange?: Function
  menu: any
}

export default class DropMenu extends React.Component<Props, State> {
  open: any
  close: any

  constructor(props: Props) {
    super(props)
    this.state = {isOpen: false, style: {}}

    this.open = (e) => {
      this.setState({
        isOpen: true,
        style: MenuStyler.getStyle(e.currentTarget, this.props.position)
      })
    }

    this.close = (e) => {
      e.stopPropagation()
      this.setState({isOpen: false})
    }
  }

  getMenu() {
    const Menu = this.props.menu
    if (this.props.dim) {
      return (
        <DimPortal
          style={this.state.style}
          isOpen={this.state.isOpen}
          onClose={this.close}
        >
          <Menu onClose={this.close} onChange={this.props.onChange} />
        </DimPortal>
      )
    } else {
      return (
        <Portal
          style={this.state.style}
          isOpen={this.state.isOpen}
          onClose={this.close}
        >
          <Menu onClose={this.close} onChange={this.props.onChange} />
        </Portal>
      )
    }
  }

  render() {
    return (
      <div className={this.props.className} onClick={this.open}>
        {this.props.children}
        {this.getMenu()}
      </div>
    )
  }
}
