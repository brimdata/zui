import React from "react"

class SearchInput extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = e => props.changeSearchBarInput(e.currentTarget.value)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(e) {
    if (e.key === "Enter") {
      this.props.submitSearchBar()
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
