/* @flow */
import React from "react"
import DragAnchor from "./DragAnchor"

type Props = {
  isOpen: boolean,
  position: string,
  onDrag: Function,
  children: *,
  width: number,
  className: string
}

export default class Pane extends React.Component<Props> {
  render() {
    if (!this.props.isOpen) return null

    const {position, onDrag, children, width, className} = this.props
    const anchorPos = position === "left" ? "right" : "left"

    return (
      <aside className={`pane pane-${position} ${className}`} style={{width}}>
        {children}
        <DragAnchor onDrag={onDrag} position={anchorPos} />
      </aside>
    )
  }
}

type Pass = {}

export const PaneHeader = (props: Pass) => (
  <header className="pane-header" {...props} />
)

export const PaneTitle = (props: Pass) => (
  <h3 className="pane-title" {...props} />
)
export const PaneBody = (props: Pass) => (
  <div className="pane-body" {...props} />
)
export const Left = (props: Pass) => <div className="left" {...props} />
export const Right = (props: Pass) => <div className="right" {...props} />
export const Center = (props: Pass) => <div className="center" {...props} />
