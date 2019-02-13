/* @flow */

import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"

import {type DispatchProps, type State} from "../reducers/types"
import {Fieldset, Paragraph, Subscript, Label} from "./Typography"
import type {TableColumn} from "../types"
import {getCurrentTableLayout} from "../selectors/tableLayouts"
import {
  hideAllColumns,
  hideColumn,
  showAllColumns,
  showColumn
} from "../actions/tableLayouts"
import CloseButton from "./CloseButton"
import TableLayout from "../models/TableLayout"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  onClose: () => *
|}

type StateProps = {|
  tableLayout: TableLayout
|}

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
|}

export default class ColumnChooserMenu extends React.Component<Props> {
  tableId() {
    return this.props.tableLayout.id
  }

  allVisible() {
    return this.props.tableLayout.allVisible()
  }

  showAllColumns = (e: Event) => {
    e.stopPropagation()
    this.props.dispatch(showAllColumns(this.props.tableLayout))
  }

  onColumnClick(e: Event, column: TableColumn) {
    e.stopPropagation()
    if (column.isVisible) {
      if (this.allVisible()) {
        this.props.dispatch(hideAllColumns(this.props.tableLayout))
        this.props.dispatch(showColumn(this.tableId(), column))
      } else if (this.props.tableLayout.visibleCount() === 1) {
        this.props.dispatch(showAllColumns(this.props.tableLayout))
      } else {
        this.props.dispatch(hideColumn(this.tableId(), column))
      }
    } else {
      this.props.dispatch(showColumn(this.tableId(), column))
    }
  }

  className() {
    return classNames("column-chooser-menu", {
      "all-visible": this.props.tableLayout.allVisible()
    })
  }

  render() {
    const columns = this.props.tableLayout.getColumns()
    const count = this.props.tableLayout.visibleCount()
    const allVisible = this.props.tableLayout.allVisible()
    return (
      <CSSTransition
        classNames="slide-in-right"
        timeout={{enter: 150, exit: 150}}
        in={true}
        appear
      >
        <div className={this.className()} onClick={e => e.stopPropagation()}>
          <Fieldset>Column Chooser</Fieldset>
          <hr />
          <CloseButton light onClick={this.props.onClose} />
          {!allVisible && (
            <div className="count" onClick={this.showAllColumns}>
              <Label>{count}</Label>
            </div>
          )}
          <ul>
            <li className="show-all" onClick={this.showAllColumns}>
              <Paragraph>Show All</Paragraph>
            </li>
            {columns.map(c => (
              <li
                className={classNames({visible: c.isVisible})}
                key={`${c.name}-${c.type}`}
                onClick={e => this.onColumnClick(e, c)}
              >
                <Paragraph>{c.name}</Paragraph>
                <Subscript>{c.type}</Subscript>
              </li>
            ))}
          </ul>
        </div>
      </CSSTransition>
    )
  }
}

const stateToProps = (state: State) => ({
  tableLayout: getCurrentTableLayout(state)
})

export const XColumnChooserMenu = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ColumnChooserMenu)
