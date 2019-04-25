/* @flow */

import React from "react"

import type {Dispatch} from "../state/types"
import {LatestError} from "./LatestError"
import ErrorFactory from "../models/ErrorFactory"
import Warn from "../icons/warning-md.svg"

type Props = {children: any, dispatch: Dispatch}
type State = {error: ?Error}

export default class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {error: null}
  }

  componentDidCatch(e: Error) {
    this.setState({error: e})
  }

  render() {
    let {error} = this.state
    if (!error) return this.props.children

    return (
      <div className="error-boundary">
        <LatestError error={ErrorFactory.create(error)} />
        <div className="body-content">
          <h1>
            <Warn />
            App Error
          </h1>
          <p>This error is not yet handled by the application.</p>
          <h3>Possible Solutions</h3>
          <ul>
            <li>
              Reload the pane <code>View -&gt; Reload</code>
            </li>
            <li>
              Reset the state <code>Window -&gt; Reset State</code>
            </li>
          </ul>
          <h3>Details</h3>
          <pre>{error.stack}</pre>
        </div>
      </div>
    )
  }
}
