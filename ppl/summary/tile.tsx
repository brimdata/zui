import useSearch from "app/core/hooks/useSearch"
import React, {forwardRef} from "react"
import styled from "styled-components"
import BarChart from "./bar-chart"
import Table from "./table"
import {ParentSize} from "@vx/responsive"
import HorizontalBarChart from "./horizontal-bar-chart"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Number from "./number"
import barChart from "./bar-chart"
import horizontalBarChart from "./horizontal-bar-chart"
import number from "./number"
import table from "./table"
import {TileFormat} from "./summary"

const Wrap = styled.div``

const BG = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 2px var(--lead);
  padding: 12px;
  background-color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  text {
    fill: var(--slate);
  }
`

const Title = styled.h2`
  ${(p) => p.theme.typography.headingList}
  margin-bottom: 24px;
`

type Props = {
  title: string
  query: string
  format: TileFormat
}

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`

const Tile = forwardRef<HTMLDivElement, Props>(function Tile(
  {title, query, format, children, ...rest},
  ref
) {
  const space = useSelector(Current.getSpace)
  const [records, _isFetching] = useSearch(query, [space])
  return (
    <Wrap ref={ref} {...rest}>
      <BG>
        <Title>{title}</Title>
        <Content>
          <Format format={format} records={records} />
        </Content>
        {/*  For react-grid-layout to add the resize handle */}
        {children}
      </BG>
    </Wrap>
  )
})

function Format({format, records}) {
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
      return <Table records={records} />
    case "number":
      return <Number record={records[0]} />
    default:
      return null
  }
}

export default Tile
