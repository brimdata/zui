/* @flow */

import {Redirect, Route, Switch, withRouter} from "react-router-dom"
import {connect} from "react-redux"
import React, {Component} from "react"

import {XConnect} from "./Connect"
import {XLatestError} from "./LatestError"
import {XNotifications} from "./Notifications"
import {XSearch} from "./Search"
import {getTimeZone} from "../state/reducers/view"
import * as Time from "../lib/Time"

type Props = {
  isConnected: boolean,
  timeZone: string
}

export default class App extends Component<Props> {
  render() {
    const {timeZone} = this.props
    Time.setZone(timeZone)
    return (
      <div className="app-wrapper">
        <XLatestError />
        <XNotifications />
        <Switch>
          <Route path="/search" component={XSearch} />
          <Route path="/connect" component={XConnect} />
          <Redirect to="/connect" />
        </Switch>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  timeZone: getTimeZone(state)
})

export const XApp = withRouter(connect(stateToProps)(App))
