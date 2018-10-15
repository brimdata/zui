/* @flow */

import React from "react"
import Warn from "../icons/warning-md.svg"

type Props = {children: any}
type State = {
  error: ?Error
}

export default class ViewerErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {error: null}
  }

  componentDidCatch(e: Error) {
    this.setState({error: e})
  }

  render() {
    if (this.state.error) {
      return (
        <div className="viewer-error-boundary">
          <div className="body-content">
            <h1>
              <Warn />
              Viewer Error
            </h1>
            <p>A client error prevented the log viewer from loading.</p>
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
            <pre>{this.state.error.stack}</pre>
          </div>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
