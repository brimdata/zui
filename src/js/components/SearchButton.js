/* @flow */

import React from "react"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"
import Modal from "./Modal"
import XCurlModal from "../connectors/XCurlModal"
import XDebugModal from "../connectors/XDebugModal"
import {connect} from "react-redux"
import {getDebugModalIsOpen} from "../reducers/view"
import {getCurlModalIsOpen} from "../reducers/view"
import {submitSearchBar} from "../actions/searchBar"
import {hideModal} from "../actions/view"
import DropMenu from "./DropMenu"
import {XSearchButtonMenu} from "./SearchButtonMenu"

type Props = {
  dispatch: Function,
  debugModalIsOpen: boolean,
  curlModalIsOpen: boolean
}

class SearchButton extends React.Component<Props> {
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

export default SearchButton
const stateToProps = state => ({
  debugModalIsOpen: getDebugModalIsOpen(state),
  curlModalIsOpen: getCurlModalIsOpen(state)
})

export const XSearchButton = connect(stateToProps)(SearchButton)
