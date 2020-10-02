import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {RightClickBuilder} from "../../types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../searches/programs"
import {md5Search} from "../../flows/searches/md5Search"
import Current from "../../state/Current"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import PanelHeading from "./PanelHeading"
import {AppDispatch} from "src/js/state/types"
import {zng} from "zealot"

type Props = {
  log: zng.Record
  contextMenu: Function
}

export const Md5Panel = ({log, contextMenu}: Props) => {
  const logMd5 = log.get("md5").toString()
  const dispatch = useDispatch<AppDispatch>()
  const spaceId = useSelector(Current.getSpaceId)
  const [tx, setTx] = useState([])
  const [rx, setRx] = useState([])
  const [md5, setMd5] = useState([])
  const [filenames, setFilenames] = useState([])
  const [status, setStatus] = useState("INIT")

  useEffect(() => {
    const {response, abort} = dispatch(md5Search(logMd5))
    response
      .status(setStatus)
      .chan(0, (records) => setFilenames(records))
      .chan(1, (records) => setMd5(records))
      .chan(2, (records) => setRx(records))
      .chan(3, (records) => setTx(records))

    return abort
  }, [])

  function getColumns(logs) {
    return logs.length ? logs[0].getColumnNames() : []
  }

  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={status}>Md5 Correlation</PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={contextMenu(
          md5Correlation(logMd5),
          getColumns(md5),
          spaceId
        )}
        name="md5 count"
        expect={1}
      />
      <AsyncTable
        logs={filenames}
        rightClick={contextMenu(
          filenameCorrelation(logMd5),
          getColumns(filenames),
          spaceId
        )}
        name="filename, mime_type count"
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={contextMenu(
            txHostsCorrelation(logMd5),
            getColumns(tx),
            spaceId
          )}
          name="tx_hosts count"
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={contextMenu(
            rxHostsCorrelation(logMd5),
            getColumns(rx),
            spaceId
          )}
          name="rx_hosts count"
          expect={5}
        />
      </div>
    </div>
  )
}

type Props2 = {
  logs: zng.Record[]
  expect: number
  name: string
  rightClick?: RightClickBuilder
}

function AsyncTable({logs, expect, name, rightClick}: Props2) {
  if (logs.length === 0) {
    return <InlineTableLoading title={`Loading ${name}...`} rows={expect} />
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0].getColumns()}
        logs={logs}
        rightClick={rightClick}
      />
    )
  }
}
