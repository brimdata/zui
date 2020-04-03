/* @flow */
import React from "react"

import LogDetails from "../state/LogDetails"
import Sharkfin from "../icons/Sharkfin"
import ToolbarButton from "./ToolbarButton"

export default function PacketsButton() {
  return (
    <div className="packets-button">
      <ToolbarButton icon={<Sharkfin />} disabled />
      <label>Packets</label>
    </div>
  )
}
