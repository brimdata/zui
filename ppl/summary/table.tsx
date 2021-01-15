import React from "react"
import {createCell} from "src/js/brim/cell"
import styled from "styled-components"

type GridProps = {templateColumns: string | undefined}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(p: GridProps) => p.templateColumns};
  ${(p) => p.theme.typography.labelSmall}
`

const Row = styled.div`
  display: contents;
  cursor: default;
  position: relative;

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

function getColSize(field) {
  if (field.data.getType() === "int") return "min-content"
  else return "auto"
}

export default function Table({records}) {
  const headers = records[0]?.flatten().getFields() || []
  const columns = headers.map(getColSize).join(" ")

  return (
    <Grid templateColumns={columns}>
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
                {createCell(field).display()}
              </Cell>
            ))}
        </Row>
      ))}
    </Grid>
  )
}
