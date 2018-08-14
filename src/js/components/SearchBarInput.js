import React from "react"

class SearchBarInput extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = e => props.changeSearchBarInput(e.currentTarget.value)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(e) {
    if (e.key === "Enter") {
      this.props.fetchMainSearch()
    }

    if (e.metaKey && e.key === "k") {
      this.props.pinSearchBar()
    }
  }

  render() {
    const {inputValue, isFetching} = this.props
    return (
      <div className="text-input-wrapper">
        <input
          type="text"
          value={inputValue}
          placeholder="Search"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          spellCheck={false}
          autoFocus="true"
          autoComplete="off"
        />
        {isFetching && (
          <div className="spin-loader-wrapper">
            <div className="spin-loader" />
          </div>
        )}
      </div>
    )
  }
}

export default SearchBarInput
