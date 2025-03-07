import PanelHeading from "src/views/detail-pane/PanelHeading"
import React from "react"
import {useSelector} from "react-redux"
import * as zed from "../../../../../../packages/superdb-types/dist"
import InlineTableLoading from "../InlineTableLoading"
import HorizontalTable from "../Tables/HorizontalTable"
import Results from "src/js/state/Results"
import {
  FILENAME_CORRELATION,
  MD5_CORRELATION,
  RX_HOSTS_CORRELATION,
  TX_HOSTS_CORRELATION,
} from "src/plugins/brimcap/zeek/ids"

export const Md5Panel = () => {
  return (
    <section className="hash-correlation sidebar-card box">
      <PanelHeading isLoading={false}>Md5 Correlation</PanelHeading>
      <AsyncTable resultId={MD5_CORRELATION} expect={1} />
      <AsyncTable resultId={FILENAME_CORRELATION} expect={1} />
      <div className="two-column">
        <AsyncTable resultId={TX_HOSTS_CORRELATION} expect={5} />
        <AsyncTable resultId={RX_HOSTS_CORRELATION} expect={5} />
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
