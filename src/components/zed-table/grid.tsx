import React from "react"
import {config} from "./config"
import {VariableSizeGrid} from "react-window"
import {Cell} from "./cell"
import {useZedTable} from "./context"
import {FillFlexParent} from "../fill-flex-parent"

export function Grid(props: {outerRef: React.Ref<HTMLDivElement>}) {
  const {table} = useZedTable()
  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <VariableSizeGrid
            width={width}
            height={height}
            itemData={table}
            columnWidth={(index) => table.columns[index].width as number}
            rowHeight={() => config.rowHeight}
            rowCount={table.rows.length}
            columnCount={table.columns.length}
            overscanRowCount={5}
            overscanColumnCount={2}
            outerRef={props.outerRef}
          >
            {Cell}
          </VariableSizeGrid>
        )
      }}
    </FillFlexParent>
  )
}
