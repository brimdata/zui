/* @flow */

import {useDispatch} from "react-redux"

import modal from "../../modal"
import useListener from "../hooks/useListener"

export default function useModalController() {
  let dispatch = useDispatch()

  function closeModal() {
    dispatch(modal.hide())
  }

  useListener(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.stopPropagation()
      e.preventDefault()
      closeModal()
    }
  })

  return {
    closeModal
  }
}
