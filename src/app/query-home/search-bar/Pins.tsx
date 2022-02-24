import {updateQuery} from "src/app/query-home/flows/update-query"
import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import SearchBar from "src/js/state/SearchBar"
import FilterNode from "src/js/components/FilterNode"
import PinEdit from "./PinEdit"
import Current from "src/js/state/Current"

function Pin({index, value}) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const query = useSelector(Current.getQuery)

  function onEdit() {
    setIsEditing(true)
  }

  function onCancel() {
    setIsEditing(false)
  }

  function onRemove(e) {
    e.stopPropagation()
    dispatch(SearchBar.removeSearchBarPin(index))
    query.removeFilterPinByNdx(index)
    dispatch(updateQuery(query))
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

  if (pins?.length === 0) return null
  return (
    <div className="pins">
      {pins?.map((value, index) => {
        return <Pin value={value} index={index} key={index} />
      })}
    </div>
  )
}
