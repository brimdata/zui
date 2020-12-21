import {useDispatch, useSelector} from "react-redux"
import React from "react"

import InputAction from "./InputAction"
import SearchBar from "../../state/SearchBar"
import Modal from "../../state/Modal"
import StarNoFillIcon from "../../icons/StarNoFillIcon"

export default function SaveAction() {
  const dispatch = useDispatch()
  const searchContents = useSelector(SearchBar.getSearchBarInputValue)
  const onClick = () =>
    dispatch(Modal.show("new-query", {value: searchContents}))

  return (
    <InputAction onClick={onClick}>
      <StarNoFillIcon />
    </InputAction>
  )
}
