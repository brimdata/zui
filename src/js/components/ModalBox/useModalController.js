/* @flow */

import {useDispatch} from "react-redux"

import type {ModalButtonTemplate} from "./types"
import {isArray, isString} from "../../lib/is"
import {last} from "../../lib/Array"
import Modal from "../../state/Modal"
import useEventListener from "../hooks/useEventListener"

export default function useModalController(template: ModalButtonTemplate) {
  let dispatch = useDispatch()
  let buttons = []

  if (isString(template)) {
    buttons = [{label: template, click: closeModal}]
  }

  if (isArray(template)) {
    buttons = template
  }

  function closeModal() {
    dispatch(Modal.hide())
  }

  function keyDown(e) {
    if (e.key === "Escape") {
      e.stopPropagation()
      e.preventDefault()
      closeModal()
    }
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      let b = last(buttons)
      if (b) {
        b.click(closeModal, e)
      } else {
        closeModal()
      }
    }
  }

  useEventListener(document, "keydown", keyDown, [template])

  return {
    closeModal,
    buttons
  }
}
