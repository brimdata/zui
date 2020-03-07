/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {isNumber} from "../lib/is"
import PacketPostProgress from "./PacketPostProgress"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function StatusBar() {
  let id = useSelector(Tab.clusterId)
  let name = useSelector(Tab.spaceName)
  let value = useSelector(Spaces.getIngestProgress(id, name))
  if (!isNumber(value)) return null

  return (
    <div className="status-bar">
      <PacketPostProgress percent={value} />
    </div>
  )
}
