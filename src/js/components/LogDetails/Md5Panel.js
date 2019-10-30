/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import type {PanelProps} from "./"
import type {RightClickBuilder} from "../../types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../searches/programs"
import {getCurrentSpace} from "../../state/reducers/spaces"
import {resultsToLogs} from "../../log/resultsToLogs"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import menu from "../../electron/menu"

export const Md5Panel = ({log, searches}: PanelProps) => {
  let space = useSelector(getCurrentSpace)

  const logMd5 = log.get("md5")
  if (!logMd5) return null
  const search = searches.find((s) => s.name === "Md5Search")
  if (!search) return null

  const status = search.status
  const tx = resultsToLogs(search.results, "3")
  const rx = resultsToLogs(search.results, "2")
  const md5 = resultsToLogs(search.results, "1")
  const filenames = resultsToLogs(search.results, "0")

  function getColumns(logs) {
    return logs.length ? logs[0].descriptor.map((c) => c.name) : []
  }

  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={status}>Md5 Correlation</PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={menu.fieldContextMenu(
          md5Correlation(logMd5),
          getColumns(md5),
          space
        )}
        name="md5 count"
        status={status}
        expect={1}
      />
      <AsyncTable
        logs={filenames}
        rightClick={menu.fieldContextMenu(
          filenameCorrelation(logMd5),
          getColumns(filenames),
          space
        )}
        name="filename, mime_type count"
        status={status}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={menu.fieldContextMenu(
            txHostsCorrelation(logMd5),
            getColumns(tx),
            space
          )}
          name="tx_hosts count"
          status={status}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={menu.fieldContextMenu(
            rxHostsCorrelation(logMd5),
            getColumns(rx),
            space
          )}
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
