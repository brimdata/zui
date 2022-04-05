import React from "react"
import {useDispatch, useStore} from "react-redux"
import StarNoFillIcon from "src/js/icons/StarNoFillIcon"
import Modal from "src/js/state/Modal"
import SearchBar from "src/js/state/SearchBar"
import InputAction from "./input-action"

export default function SaveAction() {
  const dispatch = useDispatch()
  const store = useStore()

  const onClick = () =>
    dispatch(
      Modal.show("new-query", {
        value: SearchBar.getSearchBarInputValue(store.getState())
      })
    )

  return (
    <InputAction onClick={onClick}>
      <StarNoFillIcon />
    </InputAction>
  )
}
