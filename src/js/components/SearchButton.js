/* @flow */

import React from "react"
import {ContextMenu, MenuItem} from "./ContextMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"
import Modal from "./Modal"
import XCurlModal from "../connectors/XCurlModal"
import XDebugModal from "../connectors/XDebugModal"
import * as Doc from "../lib/Doc"
import type {FixedPos} from "../lib/Doc"

type State = {
  menuIsOpen: boolean,
  showDebugModal: boolean,
  showCurlModal: boolean,
  menuStyle: FixedPos
}

type Props = {
  submitSearchBar: Function
}

class SearchButton extends React.Component<Props, State> {
  openMenu: Function
  closeMenu: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      menuIsOpen: false,
      showDebugModal: false,
      showCurlModal: false,
      menuStyle: {top: 0, right: 0}
    }
    this.openMenu = e => {
      const {left, bottom, width} = e.currentTarget.getBoundingClientRect()
      console.log(e.currentTarget.getBoundingClientRect())
      this.setState({
        menuIsOpen: true,
        menuStyle: {top: bottom + 6, right: Doc.getWidth() - left - width}
      })
    }
    this.closeMenu = () => this.setState({menuIsOpen: false})
  }

  render() {
    const {submitSearchBar} = this.props

    return (
      <div className="search-button-wrapper">
        <button className="button search-button" onClick={submitSearchBar}>
          <MagGlass />
        </button>

        <button className="button options-button" onClick={this.openMenu}>
          <Arrow />
        </button>

        {this.state.menuIsOpen && (
          <ContextMenu
            style={this.state.menuStyle}
            onOutsideClick={this.closeMenu}
          >
            <MenuItem onClick={() => {}}>Save query (coming soon)</MenuItem>
            <MenuItem onClick={() => {}}>Load query (coming soon)</MenuItem>
            <MenuItem
              onClick={() =>
                this.setState({showDebugModal: true, menuIsOpen: false})
              }
            >
              Debug query
            </MenuItem>
            <MenuItem onClick={() => this.setState({showCurlModal: true})}>
              Copy for curl
            </MenuItem>
            <MenuItem onClick={() => {}}>Copy for CLI (coming soon)</MenuItem>
          </ContextMenu>
        )}
        <Modal
          isOpen={this.state.showDebugModal}
          onClose={() => this.setState({showDebugModal: false})}
        >
          <XDebugModal />
        </Modal>

        <XCurlModal
          isOpen={this.state.showCurlModal}
          onClose={() => this.setState({showCurlModal: false})}
        />
      </div>
    )
  }
}

export default SearchButton
