/* @flow */

import React, {Component} from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import {XSearch} from "./Search"
import XConnect from "../connectors/XConnect"
import XSpaces from "../connectors/XSpaces"
import * as Time from "../lib/Time"

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
        {/* <MessageBox
          title="Lookytalk Version Error"
          style={{right: 12, bottom: 12}}
        >
          <Paragraph>
            The server and client lookytalk versions do not match.
          </Paragraph>
          <Code>
            Server: 1.2.0
            <br />
            Client: 1.2.3
          </Code>
        </MessageBox> */}

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
