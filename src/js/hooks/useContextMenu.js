/* @flow */

import {useState} from "react"

export default function useContextMenu() {
  let [show, setShow] = useState(false)
  let [style, setStyle] = useState({top: 0, left: 0})

  function handleOpen(e: MouseEvent) {
    setShow(true)
    setStyle({top: e.pageY, left: e.pageX})
  }

  function handleClose() {
    setShow(false)
  }

  return {
    handleOpen,
    handleClose,
    style,
    show
  }
}
