import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import SidebarLeft from "../icons/sidebar-left.svg"
import SidebarRight from "../icons/sidebar-right.svg"
import SettingsIcon from "../icons/settings-sm.svg"
import Modal from "./Modal"
import classNames from "classnames"
import XSettings from "../connectors/XSettings"

export default class ControlBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {settingsIsOpen: true}
    this.closeSettings = () => this.setState({settingsIsOpen: false})
  }

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

        <PanelButton onClick={() => this.setState({settingsIsOpen: true})}>
          <SettingsIcon />
        </PanelButton>

        <Modal
          className="settings-modal"
          isOpen={this.state.settingsIsOpen}
          onClose={this.closeSettings}
        >
          <XSettings onSave={this.closeSettings} />
        </Modal>

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
