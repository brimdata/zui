import React from "react"
import {useStore} from "react-redux"
import {useDispatch} from "src/app/core/state"
import StarNoFillIcon from "src/js/icons/StarNoFillIcon"
import Modal from "src/js/state/Modal"
import SearchBar from "src/js/state/SearchBar"
import InputAction from "./input-action"
import {State} from "../../../js/state/types"

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
