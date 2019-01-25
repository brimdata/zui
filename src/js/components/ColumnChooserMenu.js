/* @flow */

import React from "react"
import MenuList from "./MenuList"
import classNames from "classnames"
import * as actions from "../actions/columns"
import Columns from "../models/Columns"
import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import * as columns from "../selectors/columns"
import {type DispatchProps} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import type {State} from "../reducers/types"

type StateProps = {|
  columns: Columns
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class ColumnChooserMenu extends React.Component<Props> {
  showAll: Function
  toggle: Function

  constructor(props: Props) {
    super(props)

    this.showAll = e => {
      e.stopPropagation()
      props.dispatch(actions.setColumns([]))
    }

    this.toggle = (e, column) => {
      e.stopPropagation()
      props.dispatch(actions.toggleColumn(column))
    }
  }

  className() {
    return classNames("column-chooser-menu", {
      "all-visible": this.props.columns.allVisible()
    })
  }

  render() {
    return (
      <CSSTransition
        classNames="slide-in-right"
        timeout={{enter: 150}}
        in={true}
        appear
      >
        <div className={this.className()}>
          <MenuList>
            <li className="show-all" onClick={this.showAll}>
              Show All
            </li>
            {this.props.columns.getAll().map(c => (
              <li
                className={classNames({visible: c.isVisible})}
                key={`${c.name}-${c.type}`}
                onClick={e => this.toggle(e, c)}
              >
                {c.name}
              </li>
            ))}
          </MenuList>
        </div>
      </CSSTransition>
    )
  }
}

const stateToProps = (state: State) => ({
  columns: columns.getColumns(state)
})

export const XColumnChooserMenu = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ColumnChooserMenu)
