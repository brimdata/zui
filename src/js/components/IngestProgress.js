/* @flow */
import React from "react"

import CloseButton from "./CloseButton"
import PcapFileSvg from "../icons/pcap-file.svg"

export default function IngestProgress() {
  return (
    <div className="ingest-progress">
      <div className="icon">
        <PcapFileSvg />
      </div>
      <div className="progress">
        <p>Processing PCAPs...</p>
        <div className="progress-indicator">
          <div className="progress-track">
            <div className="progress-fill" />
          </div>
          <CloseButton />
        </div>
      </div>
    </div>
  )
}
