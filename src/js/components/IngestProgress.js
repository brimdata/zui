/* @flow */
import React from "react"

import MacSpinner from "./MacSpinner"
import PcapFileSvg from "../icons/pcap-file.svg"

export default function IngestProgress() {
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
