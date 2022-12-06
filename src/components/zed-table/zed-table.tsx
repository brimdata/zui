import React, {useRef} from "react"
import {zed} from "packages/zealot/src"
import {useMemo} from "react"
import {getCoreRowModel, useReactTable} from "@tanstack/react-table"
import {Provider} from "./context"
import {createColumns} from "./create-columns"
import {Grid} from "./grid"
import styled from "styled-components"
import {config} from "./config"
import classNames from "classnames"
import {useLocationState} from "src/js/components/hooks/use-location-state"

/**
 * TODO LIST
 *
 * - [x] The height of the table needs to account for the fixed header
 * - [x] The header must scroll left along with the table
 * - [x] Resize columns
 * - [x] Autosize columns
 * - [ ] Expand complex values
 * - [ ] Configure preview limits in the <ZedValue component />
 * - [ ] Maybe even use the <ZedValue> component in the inspector?
 * - [ ] Auto detect the size of the cells
 * - [ ] Multi-shape design?
 * - [ ] Infinite Scroll
 * - [ ] Header groups for nested records
 * - [ ] Keep track of which records you want to expand headers for
 */

const BG = styled.div`
  display: flex;
  min-height: 0;
  flex-flow: column;
  height: 100%;
  width: 100%;

  &.isResizing {
    user-select: none;
    cursor: col-resize;
  }
`

export function ZedTable(props: {
  shape: zed.TypeRecord | zed.TypeArray
  values: zed.Value[]
}) {
  const {shape, values} = props
  const [widths, setWidths] = useLocationState("columnWidths", {})
  const columns = useMemo(() => createColumns(shape, widths), [shape, widths])
  const table = useReactTable({
    columns,
    data: values,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {size: config.defaultCellWidth},
  })
  const headerHeight = table.getHeaderGroups().length * config.headerHeight
  const isResizing = table.getAllColumns().some((c) => c.getIsResizing())
  const ref = useRef<HTMLDivElement | null>(null)
  const context = useMemo(
    () => ({table, headerHeight, ref, setWidths, widths}),
    [table, headerHeight, ref, setWidths, widths]
  )

  return (
    <Provider value={context}>
      <BG className={classNames({isResizing})} ref={ref}>
        <Grid />
      </BG>
    </Provider>
  )
}
