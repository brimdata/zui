import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {fmtProgram} from "../../lib/Program"
import FilterNode from "../FilterNode"
import PinIcon from "../../icons/PinIcon"
import SearchBar from "../../state/SearchBar"

export default function Pins() {
  const dispatch = useDispatch()
  const prevProgram = useSelector(SearchBar.getSearchBarPreviousInputValue)
  const pins = useSelector(SearchBar.getSearchBarPins)
  const editing = useSelector(SearchBar.getSearchBarEditingIndex)

  function renderFilter(filter: string, index: number) {
    return (
      <FilterNode
        key={index}
        filter={filter}
        focused={editing === index}
        pending={index === -1}
        onClick={() => {
          dispatch(SearchBar.editSearchBarPin(index))
        }}
        onRemoveClick={(e) => {
          e.stopPropagation()
          dispatch(SearchBar.removeSearchBarPin(index))
        }}
      />
    )
  }

  function renderPinButton() {
    return (
      <div className="pin-button-wrapper">
        <span onClick={() => dispatch(SearchBar.editSearchBarPin(null))}>
          {fmtProgram(prevProgram)}
        </span>
        <button
          className="pin-button"
          title="⌘K"
          onClick={() => dispatch(SearchBar.pinSearchBar())}
        >
          <PinIcon />
        </button>
      </div>
    )
  }

  if (pins.length === 0) return null
  return (
    <div className="pins">
      {pins.map(renderFilter)}
      {renderPinButton()}
    </div>
  )
}
