import React from "react"
import {ContextMenu, MenuItem} from "./ContextMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"

class SearchButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {menuIsOpen: false}
    this.openMenu = () => this.setState({menuIsOpen: true})
    this.closeMenu = () => this.setState({menuIsOpen: false})
  }

  render() {
    const {fetchMainSearch} = this.props

    return (
      <div className="search-button-wrapper">
        <button className="button search-button" onClick={fetchMainSearch}>
          <MagGlass />
        </button>

        <button className="button options-button" onClick={this.openMenu}>
          <Arrow />
        </button>

        {this.state.menuIsOpen && (
          <ContextMenu onOutsideClick={this.closeMenu}>
            <MenuItem>Save query</MenuItem>
            <MenuItem>Load query</MenuItem>
            <MenuItem>Debug query</MenuItem>
            <MenuItem>Copy for CLI</MenuItem>
          </ContextMenu>
        )}
      </div>
    )
  }
}

export default SearchButton
