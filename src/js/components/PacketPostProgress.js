/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import ProgressIndicator from "./ProgressIndicator"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function PacketPostProgress() {
  let id = useSelector(Tab.clusterId)
  let name = useSelector(Tab.spaceName)
  let stats = useSelector(Spaces.getPacketPostStatus(id, name))
  if (!stats) return null
  let {packet_read_size, packet_total_size} = stats
  let percent = packet_read_size / packet_total_size
  if (percent === 1) return null

  return (
    <div className="packet-post-progress">
      <label>Processing Packets...</label>
      <ProgressIndicator percent={percent} />
    </div>
  )
}
