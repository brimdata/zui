/* @flow */

import React from "react"
import {connect} from "react-redux"
import * as TimeWindow from "../lib/TimeWindow"
import {setOuterTimeWindow} from "../actions/timeWindow"
import type {DateTuple} from "../lib/TimeWindow"
import MenuList from "./MenuList"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"

type Props = {
  dispatch: Function,
  spaceSpan: DateTuple
}

export default class SpanPickerMenu extends React.Component<Props> {
  setSpan(span) {
    this.props.dispatch(setOuterTimeWindow(span))
  }

  render() {
    return (
      <MenuList>
        <li onClick={() => this.setSpan(this.props.spaceSpan)}>Whole Space</li>
        <li onClick={() => this.setSpan(TimeWindow.last(30, "minutes"))}>
          Last 30 minutes
        </li>
        <li onClick={() => this.setSpan(TimeWindow.last(24, "hours"))}>
          Last 24 hours
        </li>
        <li onClick={() => this.setSpan(TimeWindow.last(7, "days"))}>
          Last 7 days
        </li>
        <li onClick={() => this.setSpan(TimeWindow.last(30, "days"))}>
          Last 30 days
        </li>
        <li onClick={() => this.setSpan(TimeWindow.last(90, "days"))}>
          Last 90 days
        </li>
      </MenuList>
    )
  }
}

export const XSpanPickerMenu = connect(state => ({
  spaceSpan: getCurrentSpaceTimeWindow(state)
}))(SpanPickerMenu)
