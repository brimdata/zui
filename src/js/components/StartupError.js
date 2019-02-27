/* @flow */

import React from "react"

import {Link} from "./Typography"
import {clearState} from "../initializers/initPersistance"
import AppError from "../models/AppError"
import ErrorTemplate from "./ErrorTemplate"

type Props = {
  error: AppError
}

export default class StartupError extends React.Component<Props> {
  reload = () => {
    location.reload()
  }

  clearState = () => {
    clearState()
    location.reload()
  }

  render() {
    return (
      <div className="startup-error-wrapper">
        <div>
          <ErrorTemplate error={this.props.error} />
          <div className="actions">
            <Link onClick={this.reload}>Reload</Link>
            <Link onClick={this.clearState}>Clear Cached State</Link>
          </div>
        </div>
      </div>
    )
  }
}
