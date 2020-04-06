/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {downloadPcap} from "../flows/downloadPcap"
import LogDetails from "../state/LogDetails"
import Sharkfin from "../icons/Sharkfin"
import ToolbarButton from "./ToolbarButton"
import useDebouncedEffect from "./hooks/useDebouncedEffect"

export default function PacketsButton() {
  let dispatch = useDispatch()
  let conn = useSelector(LogDetails.getConnLog)
  let [disabled, setDisabled] = useState(!conn)
  useDebouncedEffect(() => setDisabled(!conn), 100, [conn])

  function onClick() {
    if (conn) dispatch(downloadPcap(conn))
  }

  return (
    <div className="packets-button">
      <ToolbarButton
        icon={<Sharkfin />}
        disabled={disabled}
        onClick={onClick}
      />
      <label>Packets</label>
    </div>
  )
}
