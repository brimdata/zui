/* @flow */

import {connect} from "react-redux"
import {isEqual} from "lodash"
import React from "react"

import {type DateTuple} from "../lib/TimeWindow"
import type {Dispatch, State} from "../state/types"
import type {Space} from "../lib/Space"
import {type TimeObj, add, set, subtract} from "../lib/Time"
import {getCurrentSpace} from "../state/reducers/spaces"
import {getTimeWindow} from "../state/reducers/timeWindow"
import {getTimeZone} from "../state/reducers/view"
import {reactElementProps} from "../test/integration"
import {setOuterTimeWindow} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import DayPicker from "./DayPicker"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import SpanDuration from "./SpanDuration"
import TimePicker from "./TimePicker"
import useSpanPickerMenu from "./useSpanPickerMenu"

type StateProps = {|
  timeWindow: DateTuple,
  timeZone: string,
  space: Space
|}

type DispatchProps = {|
  setOuterTimeWindow: Function,
  submitSearchBar: Function
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

type LocalState = {
  fromDate: Date,
  toDate: Date,
  isFocused: boolean
}

export default class SpanPickers extends React.Component<Props, LocalState> {
  fromTime: ?TimePicker
  toTime: ?TimePicker
  toDate: ?DayPicker
  blurTimeout: TimeoutID

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.state = SpanPickers.getDerivedStateFromProps(props)
  }

  shouldComponentUpdate(props: Props, state: LocalState) {
    return !isEqual(props, this.props) || !isEqual(state, this.state)
  }

  static getDerivedStateFromProps(nextProps: Props, state: LocalState = {}) {
    if (state.isFocused) return null
    return {
      isFocused: false,
      fromDate: nextProps.timeWindow[0],
      toDate: nextProps.timeWindow[1]
    }
  }

  onFromDayChange = (day: Date) => {
    const fromDate = set(this.state.fromDate, {
      month: day.getMonth(),
      date: day.getDate(),
      year: day.getFullYear()
    })

    if (fromDate > this.state.toDate) {
      const toDate = add(fromDate, 30, "minutes")
      this.setState({fromDate, toDate})
    } else {
      this.setState({fromDate})
    }

    this.fromTime && this.fromTime.focus()
  }

  onFromTimeChange = (time: TimeObj) => {
    const fromDate = set(this.state.fromDate, time)

    if (fromDate > this.state.toDate) {
      const toDate = add(fromDate, 30, "minutes")
      this.setState({fromDate, toDate})
    } else {
      this.setState({fromDate})
    }

    this.toDate && this.toDate.focus()
  }

  onToDayChange = (day: Date) => {
    const toDate = set(this.state.toDate, {
      month: day.getMonth(),
      date: day.getDate(),
      year: day.getFullYear()
    })

    if (toDate < this.state.fromDate) {
      const fromDate = subtract(toDate, 30, "minutes")
      this.setState({fromDate, toDate})
    } else {
      this.setState({toDate})
    }

    this.toTime && this.toTime.focus()
  }

  onToTimeChange = (time: TimeObj) => {
    const toDate = set(this.state.toDate, time)
    this.setState({toDate})

    if (toDate < this.state.fromDate) {
      const fromDate = subtract(toDate, 30, "minutes")
      this.setState({fromDate, toDate})
    } else {
      this.setState({toDate})
    }

    this.toTime && this.toTime.blur()
  }

  onFocus = () => {
    this.setState({isFocused: true})
    clearTimeout(this.blurTimeout)
  }

  onBlur = () => {
    clearTimeout(this.blurTimeout)
    this.blurTimeout = setTimeout(() => {
      this.props.setOuterTimeWindow([this.state.fromDate, this.state.toDate])
      this.props.submitSearchBar()
      this.setState({isFocused: false})
    }, 100)
  }

  render() {
    if (!this.props.space) return null

    return (
      <div className="button-group span-pickers">
        <div
          className="button-group"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          <MenuBarButton>
            <DayPicker
              from={this.state.fromDate}
              to={this.state.toDate}
              day={this.state.fromDate}
              onDayChange={this.onFromDayChange}
            />
            <TimePicker
              ref={(r) => (this.fromTime = r)}
              time={this.state.fromDate}
              onTimeChange={this.onFromTimeChange}
            />
          </MenuBarButton>
          <SpanDuration span={[this.state.fromDate, this.state.toDate]} />
          <MenuBarButton>
            <DayPicker
              from={this.state.fromDate}
              to={this.state.toDate}
              day={this.state.toDate}
              onDayChange={this.onToDayChange}
              ref={(r) => (this.toDate = r)}
            />
            <TimePicker
              time={this.state.toDate}
              onTimeChange={this.onToTimeChange}
              ref={(r) => (this.toTime = r)}
            />
          </MenuBarButton>
        </div>
        <SpanPickerMenu />
      </div>
    )
  }
}

function SpanPickerMenu() {
  let menu = useSpanPickerMenu()
  return (
    <PopMenuPointy
      template={menu}
      position="bottom right"
      {...reactElementProps("span_menu")}
    >
      <MenuBarButton dropdown {...reactElementProps("span_button")} />
    </PopMenuPointy>
  )
}

const stateToProps = (state: State): StateProps => ({
  timeWindow: getTimeWindow(state),
  timeZone: getTimeZone(state),
  space: getCurrentSpace(state)
})

const dispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  setOuterTimeWindow: (span: DateTuple) => {
    return dispatch(setOuterTimeWindow(span))
  },
  submitSearchBar: () => {
    dispatch(submitSearchBar())
  }
})

export const XSpanPickers = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SpanPickers)
