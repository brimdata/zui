/* @flow */

import React from "react"
import classNames from "classnames"
import Down from "../icons/caret-bottom-sm.svg"
import {ContextMenu, MenuItem} from "./ContextMenu"
import Columns from "../models/Columns"
import * as actions from "../actions/columns"

type Props = {
  columns: Columns,
  logsTab: boolean,
  dispatch: Function
}

type State = {
  showColumnChooser: boolean,
  columnChooserStyle: Object
}

export default class ColumnChooser extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      showColumnChooser: false,
      columnChooserStyle: {}
    }
  }

  onChooserClick(e: *) {
    const {top, height, left, width} = e.currentTarget.getBoundingClientRect()
    this.setState({
      showColumnChooser: true,
      columnChooserStyle: {
        top: top + height + 6,
        left: left + width
      }
    })
  }

  render() {
    if (!this.props.logsTab) return null

    const allVisible =
      this.props.columns.getAll().length ===
      this.props.columns.getVisible().length

    const toggleColumn = (e, column) => {
      e.stopPropagation()
      this.props.dispatch(actions.toggleColumn(column))
    }

    return (
      <div className="column-chooser-wrapper">
        <a
          className={classNames("column-chooser-anchor", {
            open: this.state.showColumnChooser
          })}
          onClick={this.onChooserClick.bind(this)}
        >
          Columns <Down />
        </a>

        {this.state.showColumnChooser && (
          <ContextMenu
            className={classNames("column-chooser", {
              "all-visible": allVisible
            })}
            onOutsideClick={() => this.setState({showColumnChooser: false})}
            style={this.state.columnChooserStyle}
          >
            <MenuItem
              className="show-all"
              onClick={e => {
                e.stopPropagation()
                this.props.dispatch(actions.setColumns([]))
              }}
            >
              Show All
            </MenuItem>
            {this.props.columns.getAll().map(c => (
              <MenuItem
                className={classNames({visible: c.isVisible})}
                key={c.name}
                onClick={e => toggleColumn(e, c)}
              >
                {c.name}
              </MenuItem>
            ))}
          </ContextMenu>
        )}
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as selectedColumns from "../reducers/selectedColumns"
import * as view from "../reducers/view"

const stateToProps = state => ({
  columns: selectedColumns.getColumns(state),
  logsTab: view.getShowLogsTab(state)
})

export const XColumnChooser = connect(stateToProps)(ColumnChooser)
