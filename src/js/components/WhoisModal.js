/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DispatchProps, State} from "../state/reducers/types"
import {closeWhois} from "../state/actions"
import Modal from "./Modal"
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
        title="Whois Lookup"
        isOpen={this.props.isOpen}
        onClose={() => this.props.dispatch(closeWhois())}
        className="whois-modal"
      >
        <pre>whois {this.props.addr}</pre>
        {this.props.isFetching && <p>Loading...</p>}
        {!this.props.isFetching && <pre>{this.props.text}</pre>}
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
