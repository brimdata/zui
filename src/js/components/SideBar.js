import React from "react"
import XHistoryAside from "./../connectors/XHistoryAside"
import XSpaceSwitcher from "../connectors/XSpaceSwitcher"
import XSvg from "../icons/x-md.svg"
import MenuSvg from "../icons/menu-md.svg"

export default class SideBar extends React.Component {
  render() {
    return (
      <div className="side-bar-wrapper">
        {this.props.isOpen ? (
          <OpenSideBar {...this.props} />
        ) : (
          <ClosedSideBar {...this.props} />
        )}
      </div>
    )
  }
}

class OpenSideBar extends React.PureComponent {
  render() {
    return (
      <aside className="side-bar">
        <div className="close-button" onClick={this.props.closeSideBar}>
          <XSvg />
        </div>
        <XSpaceSwitcher />
        <XHistoryAside />
      </aside>
    )
  }
}

class ClosedSideBar extends React.PureComponent {
  render() {
    return (
      <aside className="side-bar">
        <p className="closed-side-bar-space-name">
          {this.props.currentSpaceName}
        </p>
        <div className="open-button" onClick={this.props.openSideBar}>
          <MenuSvg />
        </div>
      </aside>
    )
  }
}
