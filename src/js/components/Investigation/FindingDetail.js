/* @flow */
import React from "react"

import type {Finding} from "../../state/reducers/investigation"
import {format} from "../../lib/Time"
import {useResizeObserver} from "../../hooks/useResizeObserver"
import Log from "../../models/Log"
import VerticalTable from "../Tables/VerticalTable"

type Props = {finding: Finding}

export default function FindingDetail({finding}: Props) {
  let {ref} = useResizeObserver()

  function timeFormat(date) {
    return format(date, "MMM DD, YYYY HH:mm:ss")
  }

  let descriptor = [
    {type: "string", name: "Executed:"},
    {type: "string", name: "Space:"},
    {type: "string", name: "Span:"}
  ]

  let tuple = [
    timeFormat(finding.ts),
    finding.search.space,
    finding.search.span.map(timeFormat).join(" – ")
  ]

  let log = new Log(tuple, descriptor)
  return (
    <div className="finding-detail" ref={ref}>
      <VerticalTable descriptor={descriptor} log={log} light />
      {/* <Histogram
        width={rect.width}
        height={100}
        timeWindow={finding.search.span}
        results={finding.chart.results}
        isFetching={false}
      /> */}
    </div>
  )
}
