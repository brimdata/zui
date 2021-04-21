import {scaleLinear} from "@vx/scale"
import {formatPrimitive} from "app/core/formatters/format-zed"
import {cssVar, transparentize} from "polished"
import React from "react"
import styled from "styled-components"
import {ZedPrimitive} from "zealot/zed"

type GridProps = {templateColumns: string | undefined}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(p: GridProps) => p.templateColumns};
  ${(p) => p.theme.typography.labelSmall}
  position: relative;
`

const Row = styled.div`
  display: contents;
  cursor: default;
  position: relative;
  padding-right: 12px;

  & > * {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      bottom: 1px;
      left: 1px;
      right: 0;
      height: 1px;
      box-shadow: 0 0.5px 0 var(--cloudy);
    }
  }

  &:last-of-type > * {
    &:after {
      display: none;
    }
  }

  & > *:nth-child(1) {
    padding-left: 8px;
  }

  &:hover > * {
    background: rgba(0, 0, 0, 0.025);
  }

  &:first-of-type:last-of-type:hover > * {
    background: none;
  }
`

const Cell = styled.div`
  ${(p) => p.theme.typography.typeStyles}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 6px;
  line-height: 22px;
`

const HeaderCell = styled(Cell)`
  font-weight: 500;
  color: var(--aqua) !important;
`

const HeaderRow = styled(Row)`
  & > * {
    line-height: 24px;
  }
`
const count = cssVar("--havelock") as string

const Bar = styled.div<{top: number; percent: number; opacity: number}>`
  transition: width 500ms;
  left: 1px;
  top: ${(p) => p.top + 23 + 20}px;
  position: absolute;
  height: 2px;
  width: ${(p) => p.percent}%;
  opacity: ${(p) => p.opacity};
  background: linear-gradient(
    to right,
    ${transparentize(0, count)},
    ${transparentize(0, count)}
  );
`

function getColSize(field) {
  if (field.data.getType() === "int") return "min-content"
  else return "auto"
}

function Bars({records, x}) {
  if (!x) return null
  const max = records[0]?.get(x).getValue()
  const scale = scaleLinear({domain: [0, max], range: [0, 100]})
  return records.map((rec, i) => (
    <Bar
      key={i}
      top={i * 22}
      percent={scale(rec.get(x).getValue())}
      opacity={1}
    />
  ))
}

export default function Table({records, x}) {
  const headers = records[0]?.flatten().getFields() || []
  const columns = headers.map(getColSize).join(" ")

  return (
    <Grid templateColumns={columns}>
      <Bars records={records} x={x} />
      <HeaderRow>
        {headers.map((field, i) => (
          <HeaderCell className={field.data.getType()} key={i}>
            {field.name}
          </HeaderCell>
        ))}
      </HeaderRow>
      {records.map((rec, i) => (
        <Row key={i}>
          {rec
            .flatten()
            .getFields()
            .map((field, i) => (
              <Cell key={i} className={field.data.getType()}>
                {formatPrimitive(field.data as ZedPrimitive)}
              </Cell>
            ))}
        </Row>
      ))}
    </Grid>
  )
}
