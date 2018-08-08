import React from "react"
import TextInput from "./TextInput"
import mapJoin from "../mapJoin"
import isEmpty from "lodash/isEmpty"
import trim from "lodash/trim"
import FilterNode from "./FilterNode"
import History from "../models/History"
import isEqual from "lodash/isEqual"
import MagGlass from "../icons/magnifying-glass-md.svg"
import Pin from "../icons/pin-md.svg"

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

  onPinClick() {
    this.filterManager.pin()
    this.dispatchFilters()
    this.textInput.focus()
  }

  onEditFilterClick(index) {
    this.props.editSearchBarPin(index)
    this.textInput.focus()
  }

  onRemoveFilterClick(e, index) {
    e.stopPropagation()
    this.props.removeSearchBarPin(index)
    this.textInput.focus()
  }

  onSearchButtonClick() {
    this.saveHistory(this.props.inputValue)
    this.props.fetch()
    this.textInput.focus()
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
    const {inputValue, previousValue, pins, isFetching} = this.props
    const hasStagedFilter = !/^\s*$/.test(previousValue)
    const hasCommittedFilter = pins.length > 0

    return (
      <div className="search-bar">
        <div className="input-wrapper">
          <TextInput
            ref={node => (this.textInput = node)}
            label="Search"
            value={inputValue}
            onChange={this.onInputChange}
            onKeyDown={this.onInputKeyDown}
            spellCheck={false}
            autoFocus="true"
            autoComplete="off"
            isFetching={isFetching}
          />
          <button className="button" onClick={this.onSearchButtonClick}>
            <MagGlass />
          </button>
        </div>
        {(hasStagedFilter || hasCommittedFilter) && (
          <div className="filter-nodes-wrapper">
            {mapJoin(pins, this.renderFilter, this.renderJoinOperator)}
            {hasStagedFilter && hasCommittedFilter && this.renderJoinOperator()}
            {hasStagedFilter && this.renderFilter(previousValue, null)}
            {hasStagedFilter && this.renderPinButton()}
          </div>
        )}
      </div>
    )
  }
}
