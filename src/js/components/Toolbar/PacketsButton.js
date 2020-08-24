/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useState} from "react"

import {downloadPcap} from "../../flows/downloadPcap"
import {reactElementProps} from "../../test/integration"
import Current from "../../state/Current"
import Label from "./Label"
import LogDetails from "../../state/LogDetails"
import Sharkfin from "../../icons/Sharkfin"
import Button from "./Button"
import useDebouncedEffect from "../hooks/useDebouncedEffect"

type Props = {label: boolean, id: string}

export default function PacketsButton({label}: Props) {
  let dispatch = useDispatch()
  let conn = useSelector(LogDetails.getConnLog)
  let space = useSelector(Current.mustGetSpace)
  let [enabled, setEnabled] = useState(!!conn && space.pcap_support)

  useDebouncedEffect(() => setEnabled(!!conn && space.pcap_support), 100, [
    conn,
    space.pcap_support
  ])

  function onClick() {
    if (conn) dispatch(downloadPcap(conn))
  }

  function getTitle() {
    if (!space.pcap_support) return "This space has no pcap support."
    if (conn) return "Open packets from this connection."
    else return "No connection record found."
  }

  return (
    <div className="packets-button" title={getTitle()}>
      <Button
        icon={<Sharkfin />}
        disabled={!enabled}
        onClick={onClick}
        {...reactElementProps("pcapsButton")}
      />
      {label && <Label>Packets</Label>}
    </div>
  )
}
