import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import SidebarLeft from "../icons/sidebar-left.svg"
import SidebarRight from "../icons/sidebar-right.svg"
import Settings from "../icons/settings-sm.svg"
import Modal from "./Modal"
import classNames from "classnames"
import {zones} from "../lib/Time"

export default class ControlBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {settingsIsOpen: false}
  }

  render() {
    const {
      rightSidebarIsOpen,
      leftSidebarIsOpen,
      toggleRightSidebar,
      toggleLeftSidebar,
      setTimeZone
    } = this.props

    return (
      <div className="control-bar">
        <XSearchBar />

        <PanelButton onClick={() => this.setState({settingsIsOpen: true})}>
          <Settings />
        </PanelButton>

        <Modal
          isOpen={this.state.settingsIsOpen}
          onClose={() => this.setState({settingsIsOpen: false})}
        >
          <h1>Settings</h1>
          <p>Time Zone:</p>
          <select onChange={e => setTimeZone(e.currentTarget.value)}>
            {zones().map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
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
