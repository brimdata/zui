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
        <XSearchBar />

        <PanelButton>
          <Settings />
        </PanelButton>

        <PanelButton isActive={leftSidebarIsOpen} onClick={toggleLeftSidebar}>
          <SidebarLeft />
        </PanelButton>

        <PanelButton isActive={rightSidebarIsOpen} onClick={toggleRightSidebar}>
          <SidebarRight />
        </PanelButton>
      </div>
    )
  }
}

const PanelButton = ({isActive, children, ...rest}) => (
  <div className={classNames("control-button", {active: isActive})} {...rest}>
    {children}
  </div>
)
