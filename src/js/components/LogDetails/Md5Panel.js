/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import type {RightClickBuilder} from "../../types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../searches/programs"
import {parallelizeProcs} from "../../lib/Program"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import Tab from "../../state/Tab"
import brim from "../../brim"
import executeSearch from "../../flows/executeSearch"

export const Md5Panel = ({
  log,
  contextMenu
}: {
  log: Log,
  contextMenu: Function
}) => {
  let logMd5 = log.getString("md5")
  let dispatch = useDispatch()
  let spaceID = useSelector(Tab.spaceID)
  let span = useSelector(Tab.getSpanAsDates)
  let [tx, setTx] = useState([])
  let [rx, setRx] = useState([])
  let [md5, setMd5] = useState([])
  let [filenames, setFilenames] = useState([])
  let [status, setStatus] = useState("INIT")
  let program = parallelizeProcs([
    filenameCorrelation(logMd5),
    md5Correlation(logMd5),
    rxHostsCorrelation(logMd5),
    txHostsCorrelation(logMd5)
  ])

  function toLogs(records) {
    return records.map(brim.record).map(brim.interop.recordToLog)
  }

  useEffect(() => {
    let s = brim
      .search(program, span, spaceID)
      .id("Md5")
      .status(setStatus)
      .chan(0, (records) => setFilenames(filenames.concat(toLogs(records))))
      .chan(1, (records) => setMd5(md5.concat(toLogs(records))))
      .chan(2, (records) => setRx(rx.concat(toLogs(records))))
      .chan(3, (records) => setTx(tx.concat(toLogs(records))))

    return dispatch(executeSearch(s))
  }, [])

  function getColumns(logs) {
    return logs.length ? logs[0].descriptor.map((c) => c.name) : []
  }

  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={status}>Md5 Correlation</PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={contextMenu(
          md5Correlation(logMd5),
          getColumns(md5),
          spaceID
        )}
        name="md5 count"
        status={status}
        expect={1}
      />
      <AsyncTable
        logs={filenames}
        rightClick={contextMenu(
          filenameCorrelation(logMd5),
          getColumns(filenames),
          spaceID
        )}
        name="filename, mime_type count"
        status={status}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={contextMenu(
            txHostsCorrelation(logMd5),
            getColumns(tx),
            spaceID
          )}
          name="tx_hosts count"
          status={status}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={contextMenu(
            rxHostsCorrelation(logMd5),
            getColumns(rx),
            spaceID
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
