import React from "react"

import {Dispatch} from "../state/types"
import {LatestError} from "./LatestError"
import ErrorFactory from "../models/ErrorFactory"
import Warn from "./icons/warning-md.svg"

type Props = {children: any; dispatch: Dispatch}
type State = {error: Error | null | undefined}

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
            Error
          </h1>
          <pre>{error.stack}</pre>
          <h5>Possible Solutions</h5>
          <ul>
            <li>
              Reload the pane <code>View -&gt; Reload</code>
            </li>
            <li>
              Reset the state <code>Window -&gt; Reset State</code>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
