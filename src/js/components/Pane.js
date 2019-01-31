import React from "react"
import DragAnchor from "./DragAnchor"

export default class Pane extends React.Component {
  render() {
    if (!this.props.isOpen) return null

    const {
      position,
      onDrag,
      children,
      width,
      className,
      onMouseEnter,
      onMouseLeave
    } = this.props
    const anchorPos = position === "left" ? "right" : "left"

    return (
      <aside
        className={`pane pane-${position} ${className}`}
        style={{width}}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
        <DragAnchor onDrag={onDrag} position={anchorPos} />
      </aside>
    )
  }
}

export const PaneHeader = ({children}) => (
  <header className="pane-header">{children}</header>
)
export const PaneTitle = ({children}) => (
  <h3 className="pane-title">{children}</h3>
)
export const PaneBody = ({children}) => (
  <div className="pane-body">{children}</div>
)
export const Left = ({children}) => <div className="left">{children}</div>
export const Right = ({children}) => <div className="right">{children}</div>
export const Center = ({children}) => <div className="center">{children}</div>
