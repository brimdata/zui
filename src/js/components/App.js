/* @flow */

import React, {Component} from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import {XSearch} from "./Search"
import XConnect from "../connectors/XConnect"
import * as Time from "../lib/Time"
import {XNotifications} from "./Notifications"

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
