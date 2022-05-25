import React, {useState} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import submitSearch from "src/app/query-home/flows/submit-search"
import SearchBar from "../../state/SearchBar"
import FilterNode from "../FilterNode"
import PinEdit from "./PinEdit"

function Pin({index, value}) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)

  function onEdit() {
    setIsEditing(true)
  }

  function onCancel() {
    setIsEditing(false)
  }

  function onRemove(e) {
    e.stopPropagation()
    dispatch(SearchBar.removeSearchBarPin(index))
  }

  function onSubmit(value) {
    dispatch(SearchBar.editSearchBarPin(index, value))
    setIsEditing(false)
    dispatch(submitSearch())
    dispatch(SearchBar.focus())
  }

  function onBlur(value) {
    setIsEditing(false)
    dispatch(SearchBar.editSearchBarPin(index, value))
  }

  if (isEditing) {
    return (
      <PinEdit
        onCancel={onCancel}
        onSubmit={onSubmit}
        defaultValue={value}
        onBlur={onBlur}
      />
    )
  } else {
    return (
      <PinShow
        index={index}
        value={value}
        onClick={onEdit}
        onRemoveClick={onRemove}
        onFocus={onEdit}
      />
    )
  }
}

function PinShow({index, value, onClick, onRemoveClick, onFocus}) {
  return (
    <FilterNode
      onFocus={onFocus}
      key={index}
      filter={value}
      onClick={onClick}
      onRemoveClick={onRemoveClick}
    />
  )
}

export default function Pins() {
  const pins = useSelector(SearchBar.getSearchBarPins)

  if (pins.length === 0) return null
  return (
    <div className="pins">
      {pins.map((value, index) => {
        return <Pin value={value} index={index} key={index} />
      })}
    </div>
  )
}
