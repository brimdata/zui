import React from "react"
import MagGlass from "../icons/magnifying-glass-md.svg"

class SearchButton extends React.Component {
  render() {
    const {fetchMainSearch} = this.props

    return (
      <button className="button search-button" onClick={fetchMainSearch}>
        <MagGlass />
      </button>
    )
  }
}

export default SearchButton
