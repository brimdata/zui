/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import type {RightClickBuilder} from "../../types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../searches/programs"
import {getCurrentSpace} from "../../state/reducers/spaces"
import {parallelizeProcs} from "../../lib/Program"
import {resultsToLogs} from "../../models/resultsToLogs"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import menu from "../../electron/menu"
import useSearch from "../hooks/useSearch"

export const Md5Panel = ({log}: {log: Log}) => {
  let logMd5 = log.get("md5")
  let [results, status] = useSearch({
    name: "Md5Search",
    program: parallelizeProcs([
      filenameCorrelation(logMd5),
      md5Correlation(logMd5),
      rxHostsCorrelation(logMd5),
      txHostsCorrelation(logMd5)
    ])
  })
  let space = useSelector(getCurrentSpace)
  let tx = resultsToLogs(results, "3")
  let rx = resultsToLogs(results, "2")
  let md5 = resultsToLogs(results, "1")
  let filenames = resultsToLogs(results, "0")

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
