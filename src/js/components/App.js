/* @flow */

import {Redirect, Route, Switch, withRouter} from "react-router-dom"
import {connect} from "react-redux"
import React, {Component} from "react"

import {XNotifications} from "./Notifications"
import {XSearch} from "./Search"
import {getTimeZone} from "../reducers/view"
import * as Time from "../lib/Time"
import XConnect from "../connectors/XConnect"

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

const stateToProps = state => ({
  timeZone: getTimeZone(state)
})

export const XApp = withRouter(connect(stateToProps)(App))
