import React from "react"
import InputHistory from "../models/InputHistory"

class SearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.history = new InputHistory()

    this.onChange = e => props.changeSearchBarInput(e.currentTarget.value)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(e) {
    if (e.key === "Enter") {
      this.props.submitSearchBar()
      this.history.push(e.target.value)
    }
    if (e.key === "ArrowUp") {
      this.history.goBack()
      this.props.changeSearchBarInput(this.history.getCurrentEntry())
    }
    if (e.key === "ArrowDown") {
      this.history.goForward()
      this.props.changeSearchBarInput(this.history.getCurrentEntry())
    }
  }

  render() {
    const {inputValue} = this.props
    return (
      <div className="search-input">
        <div className="text-input-wrapper">
          <input
            id="main-search-input"
            type="text"
            value={inputValue}
            placeholder="Search"
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            spellCheck={false}
            autoFocus="true"
            autoComplete="off"
          />
        </div>
      </div>
    )
  }
}

export default SearchInput
