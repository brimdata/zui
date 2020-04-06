/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import ReactTooltip from "react-tooltip"

import {downloadPcap} from "../flows/downloadPcap"
import {reactElementProps} from "../test/integration"
import LogDetails from "../state/LogDetails"
import Sharkfin from "../icons/Sharkfin"
import ToolbarButton from "./ToolbarButton"
import useDebouncedEffect from "./hooks/useDebouncedEffect"

type Props = {label: boolean}

export default function PacketsButton({label}: Props) {
  let dispatch = useDispatch()
  let conn = useSelector(LogDetails.getConnLog)
  let [disabled, setDisabled] = useState(!conn)
  useDebouncedEffect(() => setDisabled(!conn), 100, [conn])

  function onClick() {
    if (conn) dispatch(downloadPcap(conn))
  }

  let tip = disabled
    ? "No connection record found."
    : "Open packets from this connection."

  return (
    <div
      className="packets-button"
      data-tip={tip}
      data-place="bottom"
      data-effect="solid"
      data-delay-show={300}
    >
      <ToolbarButton
        icon={<Sharkfin />}
        disabled={disabled}
        onClick={onClick}
        {...reactElementProps("pcapsButton")}
      />
      {label && <label>Packets</label>}

      <ReactTooltip />
    </div>
  )
}
