import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import SidebarLeft from "../icons/sidebar-left.svg"
import SidebarRight from "../icons/sidebar-right.svg"
import Settings from "../icons/settings-sm.svg"
import classNames from "classnames"

export default class ControlBar extends React.Component {
  render() {
    const {
      rightSidebarIsOpen,
      leftSidebarIsOpen,
      toggleRightSidebar,
      toggleLeftSidebar
    } = this.props

    return (
      <div className="control-bar">
        <img
          src="dist/static/looky-face.png"
          width="34"
          height="34"
          className="looky-face"
        />
        <XSearchBar />

        <ControlButton>
          <Settings />
        </ControlButton>

        <ControlButton isActive={leftSidebarIsOpen} onClick={toggleLeftSidebar}>
          <SidebarLeft />
        </ControlButton>

        <ControlButton
          isActive={rightSidebarIsOpen}
          onClick={toggleRightSidebar}
        >
          <SidebarRight />
        </ControlButton>
      </div>
    )
  }
}

const ControlButton = ({isActive, children, ...rest}) => (
  <div className={classNames("control-button", {active: isActive})} {...rest}>
    {children}
  </div>
)
