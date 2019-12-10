/* @flow */
import React, {useEffect, useState} from "react"

import type {Finding} from "../../state/reducers/investigation"
import {useResizeObserver} from "../hooks/useResizeObserver"
import FindingHistogramChart from "../charts/FindingHistogram/Chart"
import Log from "../../models/Log"
import VerticalTable from "../Tables/VerticalTable"
import brim, {type Ts} from "../../brim"

type Props = {finding: Finding}

export default function FindingDetail({finding}: Props) {
  let {ref} = useResizeObserver()
  let [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1)
    }, 100)
  }, [])

  function timeFormat(date: Ts) {
    return brim.time(date).format("MMM DD, YYYY HH:mm:ss")
  }

  let descriptor = [
    {type: "string", name: "Executed:"},
    {type: "string", name: "Space:"},
    {type: "string", name: "Span:"}
  ]

  let tuple = [
    timeFormat(finding.ts),
    finding.search.space,
    brim
      .span(finding.search.spanArgs)
      .toSpan()
      .map(timeFormat)
      .join(" – ")
  ]

  let log = new Log(tuple, descriptor)
  return (
    <div className="finding-detail" ref={ref} style={{opacity}}>
      {finding.chart && (
        <FindingHistogramChart
          results={finding.chart.results}
          spanArgs={finding.search.spanArgs}
        />
      )}
      <VerticalTable descriptor={descriptor} log={log} light />
    </div>
  )
}
