/* @flow */

import React from "react"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"
import Modal from "./Modal"
import {XCurlModal} from "./CurlModal"
import {XDebugModal} from "./DebugModal"
import {connect} from "react-redux"
import {getDebugModalIsOpen} from "../reducers/view"
import {getCurlModalIsOpen} from "../reducers/view"
import {submitSearchBar} from "../actions/searchBar"
import {hideModal} from "../actions/view"
import DropMenu from "./DropMenu"
import {XSearchButtonMenu} from "./SearchButtonMenu"
import {type DispatchProps} from "../reducers/types"
import type {State} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  debugModalIsOpen: boolean,
  curlModalIsOpen: boolean
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class SearchButton extends React.Component<Props> {
  render() {
    return (
      <div className="search-button-wrapper">
        <button
          className="button search-button"
          onClick={() => this.props.dispatch(submitSearchBar())}
        >
          <MagGlass />
        </button>

        <DropMenu menu={<XSearchButtonMenu />} position="right">
          <button className="button options-button">
            <Arrow />
          </button>
        </DropMenu>

        <Modal
          isOpen={this.props.debugModalIsOpen}
          onClose={() => this.props.dispatch(hideModal())}
        >
          <XDebugModal />
        </Modal>

        <XCurlModal
          isOpen={this.props.curlModalIsOpen}
          onClose={() => this.props.dispatch(hideModal())}
        />
      </div>
    )
  }
}

const stateToProps = (state: State) => ({
  debugModalIsOpen: getDebugModalIsOpen(state),
  curlModalIsOpen: getCurlModalIsOpen(state)
})

export const XSearchButton = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SearchButton)
