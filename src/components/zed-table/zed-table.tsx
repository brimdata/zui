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
import {ZedTableApi} from "./api"
import {useSelector} from "react-redux"
import Table from "src/js/state/Table"
import {useDispatch} from "src/app/core/state"

/**
 * TODO LIST
 *
 * - [x] The height of the table needs to account for the fixed header
 * - [x] The header must scroll left along with the table
 * - [x] Resize columns
 * - [x] Autosize columns
 * - [x] Expand complex values
 * - [ ] Use robust cell and value ids
 * - [ ] Configure preview limits in the <ZedValue component />
 * - [ ] Maybe even use the <ZedValue> component in the inspector?
 * - [x] Auto detect the size of the cells
 * - [x] Multi-shape design?
 * - [ ] Infinite Scroll
 * - [ ] Header groups for nested records
 * - [ ] Keep track of which records you want to expand headers for
 * - [ ] Make sure the styles are the same when you are measuring (font-family)
 * - [ ] Store the columns widths per shape, since zed identities are stable
 */

const BG = styled.div`
  display: flex;
  min-height: 0;
  flex-flow: column;
  height: 100%;
  width: 100%;
  font-family: var(--mono-font);

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
  const ref = useRef<HTMLDivElement | null>(null)
  const state = useSelector(Table.getState)
  const dispatch = useDispatch()
  const api = useMemo(() => {
    return new ZedTableApi({shape, values, state, ref, dispatch})
  }, [shape, values, ref, dispatch])
  api.state = state

  const columns = useMemo(() => createColumns(api), [api])
  api.table = useReactTable({
    columns,
    data: values,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {size: config.defaultCellWidth},
  })

  return (
    <Provider value={api}>
      <BG className={classNames({isResizing: api.isResizing})} ref={ref}>
        <Grid />
      </BG>
    </Provider>
  )
}
