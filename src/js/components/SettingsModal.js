/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Dispatch} from "../reducers/types"
import {Label} from "./Typography"
import {getTimeZone} from "../reducers/view"
import {setTimeZone} from "../actions/view"
import Modal from "./Modal"
import * as Time from "../lib/Time"
import Toggle from "./Toggle"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  timeZone: string,
  dispatch: Dispatch
}

type State = {
  useCache: boolean,
  useIndex: boolean
}

export default class SettingsModal extends React.Component<Props, State> {
  state = {
    useCache: false,
    useIndex: true
  }

  render() {
    return (
      <Modal title="Settings" isOpen={true}>
        <div className="settings-form">
          <div className="setting-panel">
            <Label>Timezone:</Label>
            <select
              onChange={e =>
                this.props.dispatch(setTimeZone(e.currentTarget.value))
              }
              value={this.props.timeZone}
            >
              {Time.zones().map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-panel">
            <Label>Enable Analytics Cache:</Label>
            <Toggle
              checked={this.state.useCache}
              onChange={() => this.setState({useCache: !this.state.useCache})}
            />
          </div>

          <div className="setting-panel">
            <Label>Enable Index Lookups:</Label>
            <Toggle
              checked={this.state.useIndex}
              onChange={() => this.setState({useIndex: !this.state.useIndex})}
            />
          </div>
        </div>
      </Modal>
    )
  }
}

const stateToProps = state => ({timeZone: getTimeZone(state)})

export const XSettingsModal = connect<Props, *, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SettingsModal)
