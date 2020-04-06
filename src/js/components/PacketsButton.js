/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"
import ReactTooltip from "react-tooltip"

import {downloadPcap} from "../flows/downloadPcap"
import {reactElementProps} from "../test/integration"
import LogDetails from "../state/LogDetails"
import Sharkfin from "../icons/Sharkfin"
import Tab from "../state/Tab"
import ToolbarButton from "./ToolbarButton"
import useDebouncedEffect from "./hooks/useDebouncedEffect"

type Props = {label: boolean}

export default function PacketsButton({label}: Props) {
  let dispatch = useDispatch()
  let conn = useSelector(LogDetails.getConnLog)
  let space = useSelector(Tab.space)
  let [enabled, setEnabled] = useState(!!conn && space.packet_support)

  useDebouncedEffect(() => setEnabled(!!conn && space.packet_support), 100, [
    conn,
    space.packet_support
  ])

  function onClick() {
    if (conn) dispatch(downloadPcap(conn))
  }

  function getTip() {
    if (!space.packet_support) return "This space has no packet support."
    if (conn) return "Open packets from this connection."
    else "No connection record found."
  }

  return (
    <div
      className="packets-button"
      data-tip={getTip()}
      data-place="bottom"
      data-effect="solid"
      data-delay-show={300}
    >
      <ToolbarButton
        icon={<Sharkfin />}
        disabled={!enabled}
        onClick={onClick}
        {...reactElementProps("pcapsButton")}
      />
      {label && <label>Packets</label>}

      <ReactTooltip />
    </div>
  )
}
