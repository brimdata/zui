import React from "react"
import {zed} from "@brimdata/zealot"
import {useZedTable} from "./context"
import {config} from "./config"
import styled from "styled-components"
import {View} from "src/app/features/inspector/views/view"

const Line = styled.div<{indent: number}>`
  white-space: pre;
  height ${config.lineHeight}px;
  padding-left: ${(props) => props.indent * 16}px;
  display: flex;
  align-items: center;
`

export const CellValue = React.memo(function CellValue(props: {view: View}) {
  const rows = props.view.ctx.rows.map(({indent, render}, i) => {
    return (
      <Line key={i} indent={indent}>
        {render}
      </Line>
    )
  })
  return <>{rows}</>
})
