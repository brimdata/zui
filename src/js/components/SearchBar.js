import React from "react"
import isEmpty from "lodash/isEmpty"
import trim from "lodash/trim"
import FilterNode from "./FilterNode"
import History from "../models/History"
import isEqual from "lodash/isEqual"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Pin from "../icons/pin-md.svg"
import XTimeWindowInput from "../connectors/XTimeWindowInput"
import XSearchBarInput from "../connectors/XSearchBarInput"
import XPins from "../connectors/XPins"

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.history = new History()
    this.renderFilter = this.renderFilter.bind(this)
    this.onInputKeyDown = this.onInputKeyDown.bind(this)
    this.onPinClick = () => this.props.pinSearchBar()
    this.onEditFilterClick = this.onEditFilterClick.bind(this)
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this)
    this.onRemoveFilterClick = this.onRemoveFilterClick.bind(this)
    this.onInputChange = e =>
      this.props.changeSearchBarInput(e.currentTarget.value)
  }

  onEditFilterClick(index) {
    this.props.editSearchBarPin(index)
  }

  onRemoveFilterClick(e, index) {
    e.stopPropagation()
    this.props.removeSearchBarPin(index)
  }

  onSearchButtonClick() {
    this.saveHistory(this.props.inputValue)
    this.props.fetch()
  }

  onInputKeyDown(e) {
    if (e.key === "Enter") {
      this.onSearchButtonClick()
    }

    if (e.metaKey && e.key === "k") {
      this.onPinClick()
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = this.history.getPrev()
      if (prev) this.props.changeSearchBarInput(prev)
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = this.history.getNext()
      if (next) this.props.changeSearchBarInput(next)
    }
  }

  saveHistory(program) {
    if (isEqual(this.history.getMostRecent(), program)) return
    if (isEmpty(trim(program))) return

    this.history.save(program)
  }

  renderFilter(filter, index) {
    return (
      <FilterNode
        key={index}
        filter={filter}
        focused={this.props.editing === index}
        pending={index === null}
        onClick={() => this.onEditFilterClick(index)}
        onRemoveClick={e => this.onRemoveFilterClick(e, index)}
      />
    )
  }

  renderJoinOperator(index) {
    return (
      <p className="join-operator" key={index + "-operator"}>
        AND
      </p>
    )
  }

  renderPinButton() {
    return (
      <button
        className="button pin-filter"
        title="⌘K"
        onClick={this.onPinClick}
      >
        <Pin />
      </button>
    )
  }

  render() {
    return (
      <div className="search-bar">
        <div className="input-wrapper">
          <XSearchBarInput />
          <XTimeWindowInput />
          <button className="button" onClick={this.onSearchButtonClick}>
            <MagGlass />
          </button>
        </div>
        <XPins />
      </div>
    )
  }
}
