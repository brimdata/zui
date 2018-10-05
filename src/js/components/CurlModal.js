/* @flow */

import React from "react"
import {SmallHeading} from "./Headings"
import Modal from "./Modal"
import * as Program from "../lib/Program"
import type {TimeWindow} from "../lib/TimeWindow"
import type {Credentials} from "../lib/Credentials"

type Props = {
  isOpen: boolean,
  onClose: Function,
  program: string,
  timeWindow: TimeWindow,
  credentials: Credentials,
  space: string
}

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
        <pre>
          curl -X POST -u {user}:{pass} -d &apos;
          {JSON.stringify(payload, null, 4)}
          &apos; {url}
        </pre>
      </Modal>
    )
  }
}
