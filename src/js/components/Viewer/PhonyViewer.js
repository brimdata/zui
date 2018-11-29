import React from "react"
import ReactDOM from "react-dom"
import LogCell from "../LogCell"
import * as Arr from "../../lib/Array"

export default class PhonyViewer extends React.Component {
  renderHeaderCell({name}) {
    return <th key={name}>{name}</th>
  }

  renderCell(datum, column, index) {
    const field = datum.getField(column.name)
    if (field) {
      return (
        <td key={`${index}-${column.name}`}>
          <LogCell field={field} log={datum} />
        </td>
      )
    } else {
      return null
    }
  }

  render() {
    const {columns, data} = this.props
    const cols = columns.getVisible()
    const headers = <tr>{cols.map(this.renderHeaderCell)}</tr>

    const renderRow = (datum, i) => (
      <tr key={i}>{cols.map(column => this.renderCell(datum, column, i))}</tr>
    )

    return ReactDOM.createPortal(
      <table className="phony-viewer" ref={r => (this.table = r)}>
        <thead>{headers}</thead>
        <tbody>{Arr.head(data, 10).map(renderRow)}</tbody>
      </table>,

      document.getElementById("measure-layer")
    )
  }
}

import {connect} from "react-redux"
import * as selectedColumns from "../../reducers/selectedColumns"
import * as mainSearch from "../../reducers/mainSearch"

const stateToProps = state => ({
  columns: selectedColumns.getColumns(state),
  data: mainSearch.getLogs(state)
})

export const XPhonyViewer = connect(stateToProps)(PhonyViewer)
