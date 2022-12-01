import React, {useRef, useState} from "react"
import {zed} from "packages/zealot/src"
import {useMemo} from "react"
import {useTable, useBlockLayout} from "@tanstack/react-table"
import {Provider} from "./context"
import {createColumns} from "./create-columns"
import {Grid} from "./grid"
import {Header} from "./header"
import styled from "styled-components"
import useListener from "src/js/components/hooks/useListener"

/**
 * TODO LIST
 *
 * - [x] The height of the table needs to account for the fixed header
 * - [x] The header must scroll left along with the table
 * - [ ] Resize columns
 * - [ ] Expand complex values
 * - [ ] Configure preview limits in the <ZedValue component />
 * - [ ] Maybe even use the <ZedValue> component in the inspector?
 * - [ ] Auto detect the size of the cells
 * - [ ] Multi-shape design?
 * - [ ] Infinite Scroll
 */

const BG = styled.div`
  display: flex;
  min-height: 0;
  flex-flow: column;
  height: 100%;
  width: 100%;
`

export function ZedTable(props: {
  shape: zed.TypeRecord | zed.TypeArray
  values: zed.Value[]
}) {
  const {shape, values} = props
  const columns = useMemo(() => createColumns(shape), [shape])
  const table = useTable({columns, data: values}, useBlockLayout)
  const context = useMemo(() => ({table}), [table])
  const grid = useRef<HTMLDivElement>()
  const header = useRef<HTMLDivElement>()

  useListener(grid.current, "scroll", (e: React.UIEvent) => {
    header.current.scrollLeft = e.currentTarget.scrollLeft
  })

  return (
    <Provider value={context}>
      <BG>
        <Header outerRef={header} />
        <Grid outerRef={grid} />
      </BG>
    </Provider>
  )
}
