/* @flow */

import {connect} from "react-redux"
import React from "react"

import {Code} from "./Typography"
import type {Credentials} from "../lib/Credentials"
import type {DateTuple} from "../lib/TimeWindow"
import {type DispatchProps, type State} from "../reducers/types"
import {copyToClipboard} from "../lib/Doc"
import {inspectSearch} from "../actions/boomd"
import Modal from "./Modal"
import * as boomd from "../reducers/boomd"
import dispatchToProps from "../lib/dispatchToProps"
import * as searchBar from "../selectors/searchBar"
import * as spaces from "../reducers/spaces"
import * as timeWindow from "../reducers/timeWindow"

type OwnProps = {|
  isOpen: boolean,
  onClose: Function
|}

type StateProps = {|
  program: string,
  timeWindow: DateTuple,
  credentials: Credentials,
  space: string
|}

type Props = {|...StateProps, ...OwnProps, ...DispatchProps|}

type LocalState = {includeCredentials: boolean, buttonText: string}

export default class CurlModal extends React.Component<Props, LocalState> {
  state = {includeCredentials: false, buttonText: "Copy to Clipboard"}

  getCredentials() {
    const {user, pass} = this.props.credentials

    if (this.state.includeCredentials) {
      return `-u ${user}:${pass}`
    } else {
      return ""
    }
  }

  copyToClip = () => {
    var node = document.getElementById("copy-to-curl-code")
    if (node) {
      copyToClipboard(node.textContent)
      this.setState({buttonText: "Copied!"})
      setTimeout(() => {
        this.setState({buttonText: "Copy to Clipboard"})
      }, 2000)
    }
  }

  render() {
    const info = this.props.dispatch(inspectSearch(this.props.program))

    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        className="curl-modal"
        title="Curl Command"
      >
        <div className="curl-form">
          <label className="label label-wrapper">
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.includeCredentials}
              onChange={e =>
                this.setState({includeCredentials: e.target.checked})
              }
            />
            Include Credentials
          </label>
          <button className="button" onClick={this.copyToClip}>
            {this.state.buttonText}
          </button>
        </div>
        {info && (
          <Code full light id="copy-to-curl-code">
            curl -X {info.method} {this.getCredentials()} -d &apos;
            {JSON.stringify(info.body, null, 2)}
            &apos; {info.url}
          </Code>
        )}

        {!info && (
          <Code full light id="copy-to-curl-code">
            Invalid Lookytalk: &apos;{this.props.program}&apos;
          </Code>
        )}
      </Modal>
    )
  }
}

const stateToProps = (state: State) => ({
  program: searchBar.getSearchProgram(state),
  space: spaces.getCurrentSpaceName(state),
  timeWindow: timeWindow.getTimeWindow(state),
  credentials: boomd.getCredentials(state)
})

export const XCurlModal = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(CurlModal)
