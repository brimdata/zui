import {useBrimApi} from "app/core/context"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Tabs from "src/js/state/Tabs"
import {reactElementProps} from "../../../../test/integration/helpers/integration"
import ThreeDotsIcon from "../../icons/ThreeDotsIcon"
import open from "../../lib/open"
import Modal from "../../state/Modal"
import Tab from "../../state/Tab"
import PopMenuPointy from "../PopMenu/PopMenuPointy"
import InputAction from "./InputAction"

export default function MenuAction() {
  const dispatch = useDispatch()
  const api = useBrimApi()
  const isFetching = useSelector(Tab.isFetching)
  const tab = useSelector(Tabs.getActive)

  const menu = [
    {label: "Debug query", click: () => dispatch(Modal.show("debug"))},
    {label: "Copy for curl", click: () => dispatch(Modal.show("curl"))},
    {label: "Copy for zq", click: () => dispatch(Modal.show("zq"))},
    {
      label: "Syntax docs",
      click: () =>
        open("https://github.com/brimdata/zed/tree/main/docs/language")
    },
    {
      label: "Kill search",
      click: () => api.abortables.abort({tab}),
      disabled: !isFetching
    }
  ]

  return (
    <PopMenuPointy template={menu} {...reactElementProps("optionsMenu")}>
      <InputAction>
        <ThreeDotsIcon />
      </InputAction>
    </PopMenuPointy>
  )
}
