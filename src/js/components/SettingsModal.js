/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch} from "../reducers/types"
import {Label} from "./Typography"
import {enableCache, enableIndex} from "../actions/boomd"
import {getTimeZone, getSettingsModalIsOpen} from "../reducers/view"
import {getUseBoomCache, getUseBoomIndex} from "../reducers/boomd"
import {hideModal, setTimeZone} from "../actions/view"
import Modal from "./Modal"
import * as Time from "../lib/Time"
import Toggle from "./Toggle"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  timeZone: string,
  isOpen: boolean,
  dispatch: Dispatch,
  useBoomCache: boolean,
  useBoomIndex: boolean
}

export default class SettingsModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        title="Preferences"
        isOpen={this.props.isOpen}
        onClose={() => this.props.dispatch(hideModal())}
      >
        <div className="settings-form">
          <div className="setting-panel">
            <Label>Timezone:</Label>
            <select
              onChange={(e) =>
                this.props.dispatch(setTimeZone(e.currentTarget.value))
              }
              value={this.props.timeZone}
            >
              {Time.zones().map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-panel">
            <Label>Enable Analytics Cache:</Label>
            <Toggle
              checked={this.props.useBoomCache}
              onChange={() =>
                this.props.dispatch(enableCache(!this.props.useBoomCache))
              }
            />
          </div>

          <div className="setting-panel">
            <Label>Enable Index Lookups:</Label>
            <Toggle
              checked={this.props.useBoomIndex}
              onChange={() =>
                this.props.dispatch(enableIndex(!this.props.useBoomIndex))
              }
            />
          </div>
        </div>
      </Modal>
    )
  }
}

const stateToProps = (state) => ({
  timeZone: getTimeZone(state),
  isOpen: getSettingsModalIsOpen(state),
  useBoomIndex: getUseBoomIndex(state),
  useBoomCache: getUseBoomCache(state)
})

export const XSettingsModal = connect<Props, *, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SettingsModal)
