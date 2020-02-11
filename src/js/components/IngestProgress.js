/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import MacSpinner from "./MacSpinner"
import PcapFileSvg from "../icons/pcap-file.svg"
import View from "../state/View"

export default function IngestProgress() {
  let show = useSelector(View.getIsIngesting)
  if (!show) return null

  return (
    <div className="ingest-progress">
      <div className="icon">
        <PcapFileSvg />
      </div>
      <p>Processing PCAPs...</p>
      <MacSpinner />
    </div>
  )
}
