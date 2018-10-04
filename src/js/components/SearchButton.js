/* @flow */

import React from "react"
import {ContextMenu, MenuItem} from "./ContextMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"
import XDebugModal from "../connectors/XDebugModal"

type State = {
  menuIsOpen: boolean,
  showDebugModal: boolean,
  showCurlModal: boolean
}

type Props = {
  submitSearchBar: Function,
  ast: Object,
  searchProgram: string
}

class SearchButton extends React.Component<Props, State> {
  openMenu: Function
  closeMenu: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      menuIsOpen: false,
      showDebugModal: false,
      showCurlModal: false
    }
    this.openMenu = () => this.setState({menuIsOpen: true})
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
          <ContextMenu onOutsideClick={this.closeMenu}>
            <MenuItem>Save query (coming soon)</MenuItem>
            <MenuItem>Load query (coming soon)</MenuItem>
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
            <MenuItem>Copy for CLI (coming soon)</MenuItem>
          </ContextMenu>
        )}
        <XDebugModal
          isOpen={this.state.showDebugModal}
          onClose={() => this.setState({showDebugModal: false})}
        />
      </div>
    )
  }
}

export default SearchButton
