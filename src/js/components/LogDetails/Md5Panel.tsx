import contextMenu from "app/detail/flows/contextMenu"
import PanelHeading from "app/detail/PanelHeading"
import React, {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {AppDispatch} from "src/js/state/types"
import {zed} from "@brimdata/zealot"
import {md5Search} from "../../../../app/search/flows/md5-search"
import InlineTableLoading from "../InlineTableLoading"
import HorizontalTable from "../Tables/HorizontalTable"

type Props = {
  record: zed.Record
}

export const Md5Panel = ({record}: Props) => {
  const logMd5 = record.get("md5").toString()
  const dispatch = useDispatch<AppDispatch>()
  const [tx, setTx] = useState([])
  const [rx, setRx] = useState([])
  const [md5, setMd5] = useState([])
  const [filenames, setFilenames] = useState([])
  const [status, setStatus] = useState("INIT")

  useEffect(() => {
    const {response, abort} = dispatch(md5Search(logMd5))
    response
      .status((status) => {
        if (status === "ABORTED") return
        setStatus(status)
      })
      .chan(0, ({rows}) => setFilenames(rows))
      .chan(1, ({rows}) => setMd5(rows))
      .chan(2, ({rows}) => setRx(rows))
      .chan(3, ({rows}) => setTx(rows))

    return abort
  }, [logMd5])

  function onRightClick(field, record) {
    dispatch(contextMenu(field, record))
  }

  return (
    <section className="hash-correlation detail-panel">
      <PanelHeading isLoading={status === "FETCHING"}>
        Md5 Correlation
      </PanelHeading>
      <AsyncTable logs={md5} onRightClick={onRightClick} expect={1} />
      <AsyncTable logs={filenames} onRightClick={onRightClick} expect={1} />
      <div className="two-column">
        <AsyncTable logs={tx} onRightClick={onRightClick} expect={5} />
        <AsyncTable logs={rx} onRightClick={onRightClick} expect={5} />
      </div>
    </section>
  )
}

type Props2 = {
  logs: zed.Record[]
  expect: number
  onRightClick?: (f: zed.Field, r: zed.Record) => void
}

function AsyncTable({logs, expect, onRightClick}: Props2) {
  if (logs.length === 0) {
    return <InlineTableLoading rows={expect} />
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0].fields}
        logs={logs}
        onRightClick={onRightClick}
      />
    )
  }
}
