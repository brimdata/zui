/* @flow */

import React from "react"
import {AutoSizer} from "react-virtualized"
import {XLogViewer} from "../components/LogViewer"
import NoResults from "./NoResults"
import {ContextMenu, MenuItem} from "./ContextMenu"
import * as actions from "../actions/columns"
import classNames from "classnames"
import Columns from "../models/Columns"

type Props = {
  hasData: boolean,
  isComplete: boolean,
  dispatch: Function,
  columns: Columns
}

type State = {
  showColumnChooser: boolean,
  columnChooserStyle: Object
}

export default class LogResults extends React.Component<Props, State> {
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
    if (!this.props.hasData && this.props.isComplete) return <NoResults />
    if (!this.props.hasData) return null

    const toggleColumn = (e, column) => {
      e.stopPropagation()
      this.props.dispatch(actions.toggleColumn(column))
    }

    const allVisible =
      this.props.columns.getAll().length ===
      this.props.columns.getVisible().length

    return (
      <div className="log-results">
        <a
          className="column-chooser-anchor"
          onClick={this.onChooserClick.bind(this)}
        >
          Columns
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
        <div className="log-viewer-wrapper">
          <AutoSizer>
            {({height, width}) => <XLogViewer height={height} width={width} />}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as mainSearch from "../reducers/mainSearch"
import * as columns from "../reducers/columns"

const stateToProps = state => ({
  hasData: mainSearch.getMainSearchEvents(state).length > 0,
  isComplete: mainSearch.getMainSearchIsComplete(state),
  columns: columns.getColumns(state)
})

export const XLogResults = connect(stateToProps)(LogResults)
