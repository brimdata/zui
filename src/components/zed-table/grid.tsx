import React from "react"
import {VariableSizeGrid} from "react-window"
import {Cell} from "./cell-component"
import {useZedTable} from "./context"
import {FillFlexParent} from "../fill-flex-parent"
import {InnerElement} from "./grid-container"
import {useResizingClasses} from "./utils"

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
  useResizingClasses()

  const ref = React.useRef<VariableSizeGrid | null>(null)
  function reset(columnIndex = 0, rowIndex = 0) {
    if (ref.current) {
      ref.current.resetAfterIndices({
        columnIndex,
        rowIndex,
        shouldForceUpdate: true,
      })
    }
  }

  React.useLayoutEffect(() => {
    reset()
  }, [api, api.args.columnVisibleState.value])

  const tuple = api.args.columnResizeInfoState.value?.columnSizingStart[0]
  let resizeWidth = 0
  let resizeIndex = null
  if (tuple) {
    const [id] = tuple
    const index = api.columns.findIndex((c) => c.id === id)
    if (index !== -1) {
      const column = api.columns[index]
      if (column) {
        resizeWidth = column.getSize()
        resizeIndex = index
      }
    }
  }

  React.useLayoutEffect(() => {
    if (resizeIndex) {
      reset(resizeIndex)
    } else {
      reset()
    }
  }, [resizeWidth, resizeIndex, api.args.columnWidthState.value])

  React.useLayoutEffect(() => {
    // This could be improved if we could
    // know which column changed.
    reset()
  }, [api.args.columnExpandedState.value])

  React.useLayoutEffect(() => {
    // This could be improved if we could
    // know which column changed.
    reset()
  }, [api.args.columnVisibleState.value])

  React.useLayoutEffect(() => {
    // This could be sped up if we knew
    // which cell changed.
    reset()
  }, [api.args.valueExpandedState.value, api.args.valuePageState.value])

  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <VariableSizeGrid
            className="zed-table__grid"
            ref={ref}
            width={width}
            height={height}
            rowCount={api.rowCount}
            rowHeight={(index) => api.getRowHeight(index)}
            columnCount={api.columnCount}
            columnWidth={(index) => api.getColumnWidth(index)}
            overscanRowCount={5}
            overscanColumnCount={2}
            initialScrollLeft={api.args.initialScrollPosition?.left}
            initialScrollTop={api.args.initialScrollPosition?.top}
            innerElementType={InnerElement}
            onScroll={(p) => {
              api.setLastEvent("scroll")
              api.args.onScroll({top: p.scrollTop, left: p.scrollLeft})
            }}
            onItemsRendered={(state) => {
              api.setGridState({
                rowStart: state.overscanRowStartIndex,
                rowStop: state.overscanRowStopIndex,
                colStart: state.overscanColumnStartIndex,
                colStop: state.overscanColumnStopIndex,
              })
            }}
          >
            {Cell}
          </VariableSizeGrid>
        )
      }}
    </FillFlexParent>
  )
}
