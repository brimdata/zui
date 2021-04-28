import {AxisBottom, AxisLeft} from "@vx/axis"
import {Group} from "@vx/group"
import {scaleBand, scaleLinear} from "@vx/scale"
import {BarRounded} from "@vx/shape"
import React from "react"
import {cssVar} from "src/js/lib/cssVar"
import styled from "styled-components"
import * as zed from "zealot/zed"

type Props = {
  records: zed.Record[]
  width: number
  height: number
  x: string
  y: string
}

const SVG = styled.svg`
  .vx-bar-rounded {
    transition: all 500ms;
  }
`

export default function HorizontalBarChart({
  width: outerWidth,
  height: outerHeight,
  records,
  x,
  y
}: Props) {
  const margin = {top: 0, left: 180, right: 0, bottom: 24}
  const width = outerWidth - margin.left - margin.right
  const height = outerHeight - margin.top - margin.bottom
  const data = records.map((r) => ({
    name: r.get(y).toString(),
    count: (r.get(x) as zed.Uint64).toInt()
  }))
  const xScale = scaleLinear({
    domain: [0, Math.max(...data.map((d) => d.count))],
    range: [0, width]
  })
  const yScale = scaleBand({
    domain: data.map((d) => d.name),
    range: [0, height],
    padding: 0.4
  })

  return (
    <SVG height={outerHeight} width={outerWidth}>
      <Group left={margin.left} top={margin.top}>
        <AxisLeft
          scale={yScale}
          stroke={cssVar("--cloudy")}
          tickStroke={cssVar("--cloudy")}
        />
        <AxisBottom
          scale={xScale}
          top={height}
          numTicks={3}
          stroke={cssVar("--cloudy")}
          tickStroke={cssVar("--cloudy")}
        />
        {data.map((d, i) => {
          const w = xScale(d.count)
          const y = yScale(d.name)
          const h = yScale.bandwidth()
          const x = 0
          return (
            <BarRounded
              fill={cssVar("--havelock")}
              key={`bar-${i}`}
              radius={4}
              x={x}
              y={y}
              width={w}
              height={h}
              right={true}
            />
          )
        })}
      </Group>
    </SVG>
  )
}
