/* @flow */

import {connect} from "react-redux"
import {isEqual} from "lodash"
import React from "react"
import ReactDOM from "react-dom"

import type {Dispatch, State} from "../../reducers/types"
import type {TableColumn} from "../../types"
import {getCurrentTableColumns} from "../../selectors/tableColumnSets"
import {getLogs} from "../../selectors/logs"
import {updateTableColumns} from "../../actions/tableColumnSets"
import * as Arr from "../../lib/Array"
import * as Doc from "../../lib/Doc"
import Log from "../../models/Log"
import LogCell from "../LogCell"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"
import dispatchToProps from "../../lib/dispatchToProps"

type StateProps = {|
  tableColumns: TableColumns,
  data: Log[]
|}

type DispatchProps = {|
  dispatch: Dispatch
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class PhonyViewer extends React.Component<Props> {
  table: *

  shouldComponentUpdate(nextProps: Props) {
    return (
      !isEqual(
        this.props.tableColumns.getVisible().map((c) => c.name),
        nextProps.tableColumns.getVisible().map((c) => c.name)
      ) || this.props.data !== nextProps.data
    )
  }

  componentDidMount() {
    this.measureColWidths()
  }

  componentDidUpdate() {
    this.measureColWidths()
  }

  measureColWidths() {
    if (this.table) {
      const cols = [].slice.call(
        this.table.querySelectorAll("th[data-width-set='false']")
      )

      const updates = cols.reduce(
        (updates, el) => ({
          ...updates,
          [el.dataset.colKey]: {width: el.getBoundingClientRect().width}
        }),
        {}
      )

      this.props.dispatch(
        updateTableColumns(this.props.tableColumns.id, updates)
      )
    }
  }

  renderHeaderCell(column: TableColumn) {
    const key = columnKey(column)
    return (
      <th key={key} data-col-key={key} data-width-set={!!column.width}>
        {column.name}
      </th>
    )
  }

  renderCell(datum: Log, column: TableColumn, index: number) {
    const field = datum.getField(column.name)
    if (field) {
      return (
        <td key={`${index}-${column.name}`}>
          <LogCell isScrolling={false} field={field} log={datum} />
        </td>
      )
    } else {
      return null
    }
  }

  render() {
    this.table = null
    const {data} = this.props
    if (!this.props.tableColumns.showHeader()) return null

    const cols = this.props.tableColumns.getVisible()
    const headers = <tr>{cols.map(this.renderHeaderCell)}</tr>

    const renderRow = (datum, i) => (
      <tr key={i}>{cols.map((column) => this.renderCell(datum, column, i))}</tr>
    )

    return ReactDOM.createPortal(
      <table className="phony-viewer" ref={(r) => (this.table = r)}>
        <thead>{headers}</thead>
        <tbody>{Arr.head(data, 10).map(renderRow)}</tbody>
      </table>,
      Doc.id("measure-layer")
    )
  }
}

const stateToProps = (state: State) => ({
  tableColumns: getCurrentTableColumns(state),
  data: getLogs(state)
})

export const XPhonyViewer = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(PhonyViewer)
