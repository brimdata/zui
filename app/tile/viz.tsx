import {ParentSize} from "@vx/vx"
import BarChart from "ppl/summary/bar-chart"
import HorizontalBarChart from "ppl/summary/horizontal-bar-chart"
import Number from "ppl/summary/number"
import {TileFormat} from "ppl/summary/summary"
import Table from "ppl/summary/table"
import React, {memo} from "react"
import styled from "styled-components"
import * as zed from "zealot/zed"

const BG = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 0 12px 12px 12px;
  animation: fadein 200ms;
`

function getViz(format, records) {
  switch (format.type) {
    case "bar-chart":
      return (
        <ParentSize>
          {({width, height}) => (
            <BarChart
              records={records}
              width={width}
              height={height}
              x={format.x}
              y={format.y}
            />
          )}
        </ParentSize>
      )
    case "horizontal-bar-chart":
      return (
        <ParentSize>
          {() => (
            <HorizontalBarChart
              records={records}
              width={200}
              height={200}
              x={format.x}
              y={format.y}
            />
          )}
        </ParentSize>
      )
    case "table":
      return <Table records={records} x={format.x} />
    case "number":
      return <Number record={records[0]} />
    default:
      return null
  }
}

type Props = {
  format: TileFormat
  records: zed.Record[]
}

function Viz({format, records}: Props) {
  return <BG>{getViz(format, records)}</BG>
}

export default memo(Viz)
