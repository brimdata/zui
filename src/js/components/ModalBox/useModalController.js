/* @flow */

import {useDispatch} from "react-redux"

import Modal from "../../state/Modal"
import useListener from "../hooks/useListener"

export default function useModalController() {
  let dispatch = useDispatch()

  function closeModal() {
    dispatch(Modal.hide())
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
