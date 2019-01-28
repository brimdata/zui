/* @flow */

import React, {Component} from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import {XSearch} from "./Search"
import XConnect from "../connectors/XConnect"
import XSpaces from "../connectors/XSpaces"
import * as Time from "../lib/Time"
import {XNotifications} from "./Notifications"

type Props = {
  isConnected: boolean,
  timeZone: string
}

class App extends Component<Props> {
  render() {
    const {isConnected, timeZone} = this.props
    Time.setZone(timeZone)
    return (
      <div className="app-wrapper">
        <XNotifications />
        <Switch>
          {isConnected && <Route path="/search" component={XSearch} />}
          {isConnected && <Route path="/spaces" component={XSpaces} />}
          <Route path="/connect" component={XConnect} />
          <Redirect to="/connect" />
        </Switch>
      </div>
    )
  }
}

export default App
