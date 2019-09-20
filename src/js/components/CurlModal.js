/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {Cluster} from "../state/clusters/types"
import {Code} from "./Typography"
import type {DateTuple} from "../lib/TimeWindow"
import type {DispatchProps, State} from "../state/types"
import {copyToClipboard} from "../lib/Doc"
import {getCurrentCluster} from "../state/clusters/selectors"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getTimeWindow} from "../state/reducers/timeWindow"
import {inspectSearch} from "../backend/thunks"
import Modal from "./Modal"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  isOpen: boolean,
  onClose: Function
|}

type StateProps = {|
  program: string,
  timeWindow: DateTuple,
  credentials: Cluster,
  space: string
|}

type Props = {|...StateProps, ...OwnProps, ...DispatchProps|}

type LocalState = {includeCredentials: boolean, buttonText: string}

export default class CurlModal extends React.Component<Props, LocalState> {
  state = {includeCredentials: false, buttonText: "Copy to Clipboard"}

  getCredentials() {
    const {username, password} = this.props.credentials

    if (this.state.includeCredentials) {
      return `-u ${username}:${password}`
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
        buttons="Done"
        name="curl"
        className="curl-modal"
        title="Curl Command"
      >
        <div className="curl-form">
          <label className="label label-wrapper">
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.includeCredentials}
              onChange={(e) =>
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
  program: getSearchProgram(state),
  space: getCurrentSpaceName(state),
  timeWindow: getTimeWindow(state),
  credentials: getCurrentCluster(state)
})

export const XCurlModal = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(CurlModal)
