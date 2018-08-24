import React from "react"
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  MultiGrid
} from "react-virtualized"
import * as cast from "../cast"
import * as fmt from "../fmt"

export default class AnalysisTable extends React.Component {
  constructor(props) {
    super(props)
    this.cache = new CellMeasurerCache({
      defaultWidth: 100,
      minWidth: 50,
      fixedHeight: true
    })
  }

  componentDidUpdate() {
    this.cache.clear()
  }

  render() {
    const {
      data: {tuples, descriptor}
    } = this.props

    const cellRenderer = ({columnIndex, rowIndex, parent, key, style}) => {
      if (rowIndex === 0) {
        return (
          <CellMeasurer
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            cache={this.cache}
            key={key}
            parent={parent}
          >
            <div className="analysis-header-cell" style={style}>
              {descriptor[columnIndex].name}
            </div>
          </CellMeasurer>
        )
      } else {
        const {type, name} = descriptor[columnIndex]
        const value = tuples[rowIndex - 1][columnIndex]
        return (
          <CellMeasurer
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            cache={this.cache}
            key={key}
            parent={parent}
          >
            <div className={`analysis-data-cell ${type} ${name}`} style={style}>
              {format(value, type)}
            </div>
          </CellMeasurer>
        )
      }
    }

    return (
      <AutoSizer>
        {({height, width}) => (
          <MultiGrid
            classNameTopRightGrid="analysis-table"
            classNameBottomRightGrid="analysis-table"
            cellRenderer={cellRenderer}
            columnCount={descriptor.length}
            columnWidth={this.cache.columnWidth}
            deferredMeasurementCache={this.cache}
            rowCount={tuples.length + 1}
            rowHeight={25}
            height={height}
            width={width}
            fixedRowCount={1}
          />
        )}
      </AutoSizer>
    )
  }
}

const format = (value, type) => {
  if (type === "time") {
    return fmt.monthDayYearHourMinute(cast.fromNanoTsToMoment(value))
  } else {
    return value
  }
}
