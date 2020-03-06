/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import ProgressIndicator from "./ProgressIndicator"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function PacketPostProgress() {
  let id = useSelector(Tab.clusterId)
  let name = useSelector(Tab.spaceName)
  let value = useSelector(Spaces.getIngestProgress(id, name))

  if (value === null) return null

  return (
    <div className="packet-post-progress">
      <label>Processing Packets...</label>
      <ProgressIndicator percent={value} />
    </div>
  )
}
