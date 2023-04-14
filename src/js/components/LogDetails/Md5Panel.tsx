import PanelHeading from "src/app/detail/PanelHeading"
import React from "react"
import {useSelector} from "react-redux"
import * as zed from "@brimdata/zed-js"
import InlineTableLoading from "../InlineTableLoading"
import HorizontalTable from "../Tables/HorizontalTable"
import * as md5 from "src/plugins/zui-zeek/md5-correlations"
import Results from "src/js/state/Results"

export const Md5Panel = () => {
  return (
    <section className="hash-correlation detail-panel">
      <PanelHeading isLoading={false}>Md5 Correlation</PanelHeading>
      <AsyncTable resultId={md5.md5Correlation.id} expect={1} />
      <AsyncTable resultId={md5.filenameCorrelation.id} expect={1} />
      <div className="two-column">
        <AsyncTable resultId={md5.txHostsCorrelation.id} expect={5} />
        <AsyncTable resultId={md5.rxHostsCorrelation.id} expect={5} />
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
