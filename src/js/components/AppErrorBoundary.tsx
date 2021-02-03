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
    const {error} = this.state
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
        </div>
      </div>
    )
  }
}
