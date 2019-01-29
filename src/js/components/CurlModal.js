/* @flow */

import React from "react"
import {SmallHeading} from "./Headings"
import Modal from "./Modal"
import * as Program from "../lib/Program"
import type {DateTuple} from "../lib/TimeWindow"
import type {Credentials} from "../lib/Credentials"
import {connect} from "react-redux"
import * as searchBar from "../selectors/searchBar"
import * as timeWindow from "../reducers/timeWindow"
import * as spaces from "../reducers/spaces"
import * as boomd from "../reducers/boomdCredentials"
import {type State} from "../reducers/types"
import {Code} from "./Typography"

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
      >
        <SmallHeading>Curl Command</SmallHeading>
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
