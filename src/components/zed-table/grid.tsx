import React from "react"
import {VariableSizeGrid} from "react-window"
import {Cell} from "./cell-component"
import {useZedTable} from "./context"
import {FillFlexParent} from "../fill-flex-parent"
import {InnerElement} from "./grid-container"
import {useColumnSizeRerender} from "./utils"

/**
 * Auto Size Logic
 *
 * 1. Keep track of which columns have been measured in a ref object
 * 2. Keep track of which columns have been rendered
 * 3. When the number of rendered columns changes, measure the new columns
 * 4. When measuring, lookup all the cells for all the columns, then measure them,
 * 5. Then simply return an {id: newWidth} data
 */

export function Grid() {
  const api = useZedTable()
  const gridRef = useColumnSizeRerender()

  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <VariableSizeGrid
            className="zed-table--grid"
            ref={gridRef}
            width={width}
            height={height}
            rowCount={api.rowCount}
            rowHeight={(index) => api.getRowHeight(index)}
            columnCount={api.columnCount}
            columnWidth={(index) => api.getColumnWidth(index)}
            overscanRowCount={5}
            overscanColumnCount={2}
            innerElementType={InnerElement}
            onScroll={() => {
              api.lastEvent = "scroll"
            }}
            onItemsRendered={(gridState) => {
              api.gridState = gridState
            }}
          >
            {Cell}
          </VariableSizeGrid>
        )
      }}
    </FillFlexParent>
  )
}
