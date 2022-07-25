import contextMenu from "src/app/detail/flows/contextMenu"
import PanelHeading from "src/app/detail/PanelHeading"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppDispatch} from "src/js/state/types"
import {zed} from "@brimdata/zealot"
import InlineTableLoading from "../InlineTableLoading"
import HorizontalTable from "../Tables/HorizontalTable"
import * as md5 from "src/plugins/zui-zeek/md5-correlations"
import Results from "src/js/state/Results"

export const Md5Panel = () => {
  const dispatch = useDispatch<AppDispatch>()

  function onRightClick(field, record) {
    dispatch(contextMenu(field, record))
  }

  return (
    <section className="hash-correlation detail-panel">
      <PanelHeading isLoading={false}>Md5 Correlation</PanelHeading>
      <AsyncTable
        resultId={md5.md5Correlation.id}
        onRightClick={onRightClick}
        expect={1}
      />
      <AsyncTable
        resultId={md5.filenameCorrelation.id}
        onRightClick={onRightClick}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          resultId={md5.txHostsCorrelation.id}
          onRightClick={onRightClick}
          expect={5}
        />
        <AsyncTable
          resultId={md5.rxHostsCorrelation.id}
          onRightClick={onRightClick}
          expect={5}
        />
      </div>
    </section>
  )
}

type Props2 = {
  resultId: string
  expect: number
  onRightClick?: (f: zed.Field, r: zed.Record) => void
}

function AsyncTable({resultId, expect, onRightClick}: Props2) {
  const logs = useSelector(Results.getValues(resultId)) as zed.Record[]
  const isFetching = useSelector(Results.isFetching(resultId))
  if (logs.length === 0 && isFetching) {
    return <InlineTableLoading rows={expect} />
  } else if (logs.length === 0) {
    return null
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0]?.fields}
        logs={logs}
        onRightClick={onRightClick}
      />
    )
  }
}
