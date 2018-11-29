/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import * as Doc from "../lib/Doc"
import type {FixedPos} from "../lib/Doc"
import classNames from "classnames"

type Props = {
  children: any,
  style: FixedPos,
  className?: string,
  onOutsideClick: Function
}

type State = FixedPos

export class ContextMenu extends React.Component<Props, State> {
  ref: any

  constructor(props: Props) {
    super(props)
    this.ref = React.createRef()
    this.state = {...props.style}
  }

  componentDidMount() {
    this.ensureVisiblePosition()
  }

  ensureVisiblePosition() {
    const {left, top, width, height} = this.ref.getBoundingClientRect()

    if (top + height > Doc.getHeight()) {
      if (top - height >= 0) {
        this.setState({top: top - height})
      } else {
        this.setState({height: Doc.getHeight() - top - 6})
      }
    }

    if (left + width > Doc.getWidth()) {
      this.setState({left: left - width})
    }
  }

  render() {
    return ReactDOM.createPortal(
      <div className="context-menu-overlay" onClick={this.props.onOutsideClick}>
        <ul
          className={classNames("context-menu", this.props.className)}
          ref={r => (this.ref = r)}
          style={{...this.state}}
        >
          {this.props.children}
        </ul>
      </div>,
      Doc.id("context-menu-root")
    )
  }
}

type ItemProps = {onClick: Function, children: any, className?: string}
export const MenuItem = ({onClick, children, className}: ItemProps) => (
  <li onClick={onClick} className={className}>
    {children}
  </li>
)
