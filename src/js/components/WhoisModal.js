/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps, State} from "../state/types"
import Modal from "./Modal"
import TextContent from "./TextContent"
import dispatchToProps from "../lib/dispatchToProps"
import * as whois from "../state/reducers/whois"

type StateProps = {|
  isOpen: boolean,
  text: string,
  isFetching: boolean,
  addr: string
|}

type Props = {...DispatchProps, ...StateProps}

export default class WhoisModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        name="whois"
        title="Whois Lookup"
        className="whois-modal"
        buttons="Done"
      >
        <TextContent>
          <pre>whois {this.props.addr}</pre>
          {this.props.isFetching && <p>Loading...</p>}
          {!this.props.isFetching && (
            <pre className="output">{this.props.text}</pre>
          )}
        </TextContent>
      </Modal>
    )
  }
}

const stateToProps = (state: State) => ({
  text: whois.getWhoisText(state),
  isOpen: whois.getWhoisIsOpen(state),
  isFetching: whois.getWhoisIsFetching(state),
  addr: whois.getWhoisAddr(state)
})

export const XWhoisModal = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(WhoisModal)
