/* @flow */
import React, {useEffect, useState} from "react"

import type {Finding} from "../../state/reducers/investigation"
import {format} from "../../lib/Time"
import {resultsToLogs} from "../../log/resultsToLogs"
import {useResizeObserver} from "../../hooks/useResizeObserver"
import FindingHistogram from "../FindingHistogram"
import Log from "../../models/Log"
import VerticalTable from "../Tables/VerticalTable"

type Props = {finding: Finding}

export default function FindingDetail({finding}: Props) {
  let {ref} = useResizeObserver()
  let [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1)
    }, 100)
  }, [])

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
    <div className="finding-detail" ref={ref} style={{opacity}}>
      {finding.chart && (
        <FindingHistogram
          logs={resultsToLogs(finding.chart.results, "0")}
          span={finding.search.span}
        />
      )}
      <VerticalTable descriptor={descriptor} log={log} light />
    </div>
  )
}
