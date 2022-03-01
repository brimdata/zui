import {useBrimApi} from "src/app/core/context"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Tabs from "src/js/state/Tabs"
import Viewer from "src/js/state/Viewer"
import ThreeDotsIcon from "../../icons/ThreeDotsIcon"
import open from "../../lib/open"
import Modal from "../../state/Modal"
import PopMenuPointy from "../PopMenu/PopMenuPointy"
import InputAction from "./InputAction"
import links from "src/app/core/links"

export default function MenuAction() {
  const dispatch = useDispatch()
  const api = useBrimApi()
  const isFetching = useSelector(Viewer.isFetching)
  const tab = useSelector(Tabs.getActive)

  const menu = [
    {label: "Debug query", click: () => dispatch(Modal.show("debug"))},
    {label: "Copy for curl", click: () => dispatch(Modal.show("curl"))},
    {label: "Copy for zq", click: () => dispatch(Modal.show("zq"))},
    {
      label: "Syntax docs",
      click: () => open(links.ZED_DOCS_LANGUAGE)
    },
    {
      label: "Kill search",
      click: () => api.abortables.abort({tab}),
      disabled: !isFetching
    }
  ]

  return (
    <PopMenuPointy template={menu}>
      <InputAction>
        <ThreeDotsIcon />
      </InputAction>
    </PopMenuPointy>
  )
}
