import React from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import XSearch from "../connectors/XSearch"
import XConnect from "../connectors/XConnect"
import XSpaces from "../connectors/XSpaces"

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.connectBoomd()
  }

  render() {
    const {isConnected} = this.props
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
