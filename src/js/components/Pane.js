/* @flow */
import React from "react"
import classNames from "classnames"

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

type Pass = {
  classNames?: string
}

export const PaneHeader = (props: Pass) => (
  <header {...props} className="pane-header" />
)

export const PaneTitle = (props: Pass) => (
  <h3 {...props} className="pane-title" />
)
export const PaneBody = (props: Pass) => (
  <div {...props} className="pane-body" />
)
export const Left = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("left", className)} />
)
export const Right = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("right", className)} />
)
export const Center = ({className, ...props}: Pass) => (
  <div {...props} className={classNames("center", className)} />
)
