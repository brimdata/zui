/* @flow */

import React from "react"
import classNames from "classnames"
import * as actions from "../actions/columns"
import Columns from "../models/Columns"
import {CSSTransition} from "react-transition-group"
import {connect} from "react-redux"
import * as columns from "../selectors/columns"
import {type DispatchProps} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"
import type {State} from "../reducers/types"
import {Fieldset, Paragraph, Subscript, Label} from "./Typography"
import CloseButton from "./CloseButton"

type OwnProps = {|
  onClose: () => *
|}

type StateProps = {|
  columns: Columns
|}

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
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
    const count = this.props.columns.getVisible().length
    const allVisible = this.props.columns.allVisible()
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
            <div className="count" onClick={this.showAll}>
              <Label>{count}</Label>
            </div>
          )}
          <ul>
            <li className="show-all" onClick={this.showAll}>
              <Paragraph>Show All</Paragraph>
            </li>
            {this.props.columns.getAll().map(c => (
              <li
                className={classNames({visible: c.isVisible})}
                key={`${c.name}-${c.type}`}
                onClick={e => this.toggle(e, c)}
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
  columns: columns.getColumns(state)
})

export const XColumnChooserMenu = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ColumnChooserMenu)
