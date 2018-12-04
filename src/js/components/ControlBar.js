import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import Modal from "./Modal"
import XSettings from "../connectors/XSettings"
import HistoryStepper from "./HistoryStepper"

export default class ControlBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {settingsIsOpen: false}
    this.closeSettings = () => this.setState({settingsIsOpen: false})
  }

  render() {
    return (
      <div className="control-bar">
        <HistoryStepper />
        <XSearchBar />
        <Modal
          className="settings-modal"
          isOpen={this.state.settingsIsOpen}
          onClose={this.closeSettings}
        >
          <XSettings onSave={this.closeSettings} />
        </Modal>
      </div>
    )
  }
}
