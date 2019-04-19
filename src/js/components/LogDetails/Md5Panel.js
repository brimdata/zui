/* @flow */

import React from "react"

import type {PanelProps} from "./"
import type {RightClickBuilder} from "../../types"
import {correlationMenu} from "../../rightclick/correlationMenu"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../models/searches/programs"
import {resultsToLogs} from "../../log/resultsToLogs"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"

export const Md5Panel = ({log, searches}: PanelProps) => {
  const logMd5 = log.get("md5")
  if (!logMd5) return null
  const search = searches.find((s) => s.name === "Md5Search")
  if (!search) return null

  const status = search.status
  const tx = resultsToLogs(search.results, "0")
  const rx = resultsToLogs(search.results, "1")
  const md5 = resultsToLogs(search.results, "2")
  const filenames = resultsToLogs(search.results, "3")

  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={status}>Md5 Correlation</PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={correlationMenu(md5Correlation(logMd5))}
        name="md5 count"
        status={status}
        expect={1}
      />
      <AsyncTable
        logs={filenames}
        rightClick={correlationMenu(filenameCorrelation(logMd5))}
        name="filename, mime_type count"
        status={status}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={correlationMenu(txHostsCorrelation(logMd5))}
          name="tx_hosts count"
          status={status}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={correlationMenu(rxHostsCorrelation(logMd5))}
          name="rx_hosts count"
          status={status}
          expect={5}
        />
      </div>
    </div>
  )
}

type Props = {
  logs: Log[],
  expect: number,
  name: string,
  rightClick?: RightClickBuilder
}

function AsyncTable({logs, expect, name, rightClick}: Props) {
  if (logs.length === 0) {
    return <InlineTableLoading title={`Loading ${name}...`} rows={expect} />
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0].descriptor}
        logs={logs}
        rightClick={rightClick}
      />
    )
  }
}
