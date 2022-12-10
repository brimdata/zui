import React, {useRef} from "react"
import {config} from "./config"
import {VariableSizeGrid} from "react-window"
import {Cell} from "./cell"
import {useZedTable} from "./context"
import {FillFlexParent} from "../fill-flex-parent"
import {InnerElement} from "./grid-container"
import {useColumnSizeRerender} from "./utils"
import {useAutosize} from "./autosize"

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
  const {setEnd} = useAutosize()
  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <VariableSizeGrid
            ref={gridRef}
            width={width}
            height={height}
            columnWidth={(index) => api.columns[index].getSize()}
            rowHeight={(index) => api.getRowHeight(index)}
            rowCount={api.rows.length}
            columnCount={api.columns.length}
            overscanRowCount={5}
            overscanColumnCount={2}
            innerElementType={InnerElement}
            onItemsRendered={(props) => {
              setEnd(props.overscanColumnStopIndex)
            }}
          >
            {Cell}
          </VariableSizeGrid>
        )
      }}
    </FillFlexParent>
  )
}
