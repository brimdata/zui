import React from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import XSearch from "../connectors/XSearch"
import XConnect from "../connectors/XConnect"
import XSpaces from "../connectors/XSpaces"
import * as Time from "../lib/Time"

class App extends React.Component {
  render() {
    const {isConnected, timeZone} = this.props
    Time.setZone(timeZone)
    return (
      <Switch>
        {isConnected && <Route path="/search" component={XSearch} />}
        {isConnected && <Route path="/spaces" component={XSpaces} />}
        <Route path="/connect" component={XConnect} />
        <Redirect to="/connect" />
      </Switch>
    )
  }
}

export default App
