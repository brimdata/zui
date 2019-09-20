/* @flow */
import {useDispatch, useSelector} from "react-redux"
import {useEffect} from "react"

import {getModal} from "../state/reducers/view"
import {hideModal} from "../state/actions"

export default function useModal(name: string) {
  let modal = useSelector(getModal)
  let dispatch = useDispatch()
  let isOpen = modal === name

  function close() {
    dispatch(hideModal())
  }

  function onKeyPress(e: KeyboardEvent) {
    if (!isOpen) return
    if (e.key === "Enter" || e.key == "Escape") {
      close()
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress, false)
    return () => {
      document.removeEventListener("keypress", onKeyPress, false)
    }
  }, [])

  return {
    close,
    isOpen
  }
}
