/* @flow */

import React from "react"

import {AsyncTable} from "./AsyncTable"
import type {PanelProps} from "./"
import PanelHeading from "./PanelHeading"

export const Md5Panel = ({log, statuses, relatedLogs}: PanelProps) => {
  if (!log.get("md5")) return null

  const {md5, tx, rx} = relatedLogs
  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={statuses["Md5Search"]}>
        Md5 Correlation
      </PanelHeading>
      <AsyncTable
        logs={md5}
        name="md5 count"
        status={statuses["Md5Search"]}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          name="tx_hosts count"
          status={statuses["Md5Search"]}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          name="rx_hosts count"
          status={statuses["Md5Search"]}
          expect={5}
        />
      </div>
    </div>
  )
}
