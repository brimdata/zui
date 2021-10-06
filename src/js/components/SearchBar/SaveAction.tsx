import React from "react"
import {useDispatch, useStore} from "react-redux"
import StarNoFillIcon from "../../icons/StarNoFillIcon"
import Modal from "../../state/Modal"
import SearchBar from "../../state/SearchBar"
import InputAction from "./InputAction"

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
