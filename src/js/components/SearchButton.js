import React from "react"
import Prism from "prismjs"
import {ContextMenu, MenuItem} from "./ContextMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Arrow from "../icons/caret-bottom-sm.svg"
import Modal from "./Modal"
import {SmallHeading, LargeHeading} from "./Headings"

class SearchButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {menuIsOpen: false, showAstModal: false}
    this.openMenu = () => this.setState({menuIsOpen: true})
    this.closeMenu = () => this.setState({menuIsOpen: false})
  }

  render() {
    const {submitSearchBar, ast, searchProgram} = this.props

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
                this.setState({showAstModal: true, menuIsOpen: false})
              }
            >
              Debug query
            </MenuItem>
            <MenuItem>Copy for CLI (coming soon)</MenuItem>
          </ContextMenu>
        )}
        <Modal
          isOpen={this.state.showAstModal}
          onClose={() => {
            this.setState({showAstModal: false})
          }}
          className="debug-query-modal"
        >
          <SmallHeading>Search Program</SmallHeading>
          <pre>{searchProgram}</pre>
          <SmallHeading>Abstract Syntax Tree</SmallHeading>
          <pre>
            <code
              class="language-js"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(ast, Prism.languages.js, "JSON")
              }}
            />
          </pre>
        </Modal>
      </div>
    )
  }
}

export default SearchButton
