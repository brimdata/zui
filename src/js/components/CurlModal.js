/* @flow */

import {connect} from "react-redux"
import React from "react"

import {Code} from "./Typography"
import type {Credentials} from "../lib/Credentials"
import type {DateTuple} from "../lib/TimeWindow"
import {type State} from "../reducers/types"
import Modal from "./Modal"
import * as Program from "../lib/Program"
import * as boomd from "../reducers/boomdCredentials"
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

type Props = {|...StateProps, ...OwnProps|}

export default class CurlModal extends React.Component<Props> {
  render() {
    const {space, program, timeWindow, credentials} = this.props
    if (!timeWindow[0]) return null
    const {host, port, user, pass} = credentials
    const [ast, _error] = Program.parse(program)
    const payload = {
      ...ast,
      from: (timeWindow[0].getTime() / 1000).toString(),
      to: (timeWindow[1].getTime() / 1000).toString(),
      space
    }
    const url = `http://${host}:${port}/search`
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        className="curl-modal"
        title="Curl Command"
      >
        <form className="curl-form">
          <label className="label label-wrapper">
            <input type="checkbox" className="checkbox" />
            Include Credentials
          </label>
          <button className="button">Copy To Clipboard</button>
        </form>
        <Code full light>
          curl -X POST -u {user}:{pass} -d &apos;
          {JSON.stringify(payload, null, 4)}
          &apos; {url}
        </Code>
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

export const XCurlModal = connect<Props, OwnProps, _, _, _, _>(stateToProps)(
  CurlModal
)
