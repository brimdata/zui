import React from "react"
import {useStore} from "react-redux"
import {useDispatch} from "src/app/core/state"
import StarNoFillIcon from "../../icons/StarNoFillIcon"
import Modal from "../../state/Modal"
import SearchBar from "../../state/SearchBar"
import InputAction from "./InputAction"
import {State} from "../../state/types"

export default function SaveAction() {
  const dispatch = useDispatch()
  const store = useStore<State>()

  const onClick = () =>
    dispatch(
      Modal.show("new-query", {
        value: SearchBar.getSearchBarInputValue(store.getState()),
      })
    )

  return (
    <InputAction onClick={onClick}>
      <StarNoFillIcon />
    </InputAction>
  )
}
