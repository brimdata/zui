/* @flow */

import {connect} from "react-redux"
import React from "react"

import {type DateTuple, last} from "../lib/TimeWindow"
import {type DispatchProps} from "../reducers/types"
import {add} from "../lib/Time"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import {setOuterTimeWindow} from "../actions/timeWindow"
import {submitSearchBar} from "../actions/searchBar"
import MenuList from "./MenuList"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  spaceSpan: DateTuple
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class SpanPickerMenu extends React.Component<Props> {
  setSpan(span: DateTuple) {
    this.props.dispatch(setOuterTimeWindow(span))
    this.props.dispatch(submitSearchBar())
  }

  render() {
    return (
      <MenuList>
        <li onClick={() => this.setSpan(this.props.spaceSpan)}>Whole Space</li>
        <li onClick={() => this.setSpan(last(30, "minutes"))}>
          Last 30 minutes
        </li>
        <li onClick={() => this.setSpan(last(24, "hours"))}>Last 24 hours</li>
        <li onClick={() => this.setSpan(last(7, "days"))}>Last 7 days</li>
        <li onClick={() => this.setSpan(last(30, "days"))}>Last 30 days</li>
        <li onClick={() => this.setSpan(last(90, "days"))}>Last 90 days</li>
      </MenuList>
    )
  }
}

export const XSpanPickerMenu = connect<Props, {||}, _, _, _, _>(
  (state) => {
    const [from, to] = getCurrentSpaceTimeWindow(state)
    return {
      spaceSpan: [from, add(to, 1, "ms")]
    }
  },
  dispatchToProps
)(SpanPickerMenu)
