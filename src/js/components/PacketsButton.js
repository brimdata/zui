/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {downloadPcap} from "../flows/downloadPcap"
import {reactElementProps} from "../test/integration"
import BrimTooltip from "./BrimTooltip"
import LogDetails from "../state/LogDetails"
import Sharkfin from "../icons/Sharkfin"
import Tab from "../state/Tab"
import ToolbarButton from "./ToolbarButton"
import useDebouncedEffect from "./hooks/useDebouncedEffect"

type Props = {label: boolean, id: string}

export default function PacketsButton({label, id}: Props) {
  let dispatch = useDispatch()
  let conn = useSelector(LogDetails.getConnLog)
  let space = useSelector(Tab.space)
  let [enabled, setEnabled] = useState(!!conn && space.pcap_support)

  useDebouncedEffect(() => setEnabled(!!conn && space.pcap_support), 100, [
    conn,
    space.pcap_support
  ])

  function onClick() {
    if (conn) dispatch(downloadPcap(conn))
  }

  function getTip() {
    if (!space.pcap_support) return "This space has no pcap support."
    if (conn) return "Open packets from this connection."
    else return "No connection record found."
  }

  return (
    <div
      className="packets-button"
      data-tip=""
      data-place="bottom"
      data-effect="solid"
      data-delay-show={500}
      data-for={id}
    >
      <ToolbarButton
        icon={<Sharkfin />}
        disabled={!enabled}
        onClick={onClick}
        {...reactElementProps("pcapsButton")}
      />
      {label && <label>Packets</label>}
      <BrimTooltip id={id}>{getTip()}</BrimTooltip>
    </div>
  )
}
