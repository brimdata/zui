/* @flow */

import {Redirect} from "react-router-dom"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import React from "react"

import type {Credentials} from "../lib/Credentials"
import {connectBoomd} from "../state/thunks/boomd"
import {getCredentials} from "../state/reducers/boomd"
import {setBoomdCredentials} from "../state/actions"
import AdminTitle from "./AdminTitle"
import AppError from "../models/AppError"
import ErrorFactory from "../models/ErrorFactory"
import LookyHeader from "./LookyHeader"
import delay from "../lib/delay"

type Props = {|
  credentials: Credentials,
  setBoomdCredentials: Function,
  connectBoomd: Function
|}

type CompState = {|
  ...$Exact<Credentials>,
  error: ?AppError,
  isConnected: boolean,
  isConnecting: boolean
|}

export default class Connect extends React.Component<Props, CompState> {
  constructor(props: Props) {
    super(props)
    this.state = {
      ...props.credentials,
      error: null,
      isConnecting: false,
      isConnected: false
    }
  }

  onSubmit = (e: Event) => {
    this.setState({isConnecting: true, error: null})
    e.preventDefault()
    this.props.setBoomdCredentials(this.state)
    this.props
      .connectBoomd()
      .then(() => delay(300, () => this.setState({isConnected: true})))
      .catch((e) => {
        delay(300, () =>
          this.setState({
            isConnecting: false,
            error: ErrorFactory.create(e)
          })
        )
      })
  }

  render() {
    if (this.state.isConnected) {
      return <Redirect to="/search" />
    }

    return (
      <main className="admin-page boomd-connect">
        <LookyHeader />
        <AdminTitle title="Connect To Boom" />

        <div className="admin-panel-wrapper">
          <div className="admin-panel">
            <form className="admin-form" onSubmit={this.onSubmit}>
              <div className="form-field">
                <label>Host</label>
                <input
                  autoFocus
                  type="text"
                  name="host"
                  value={this.state.host || ""}
                  onChange={(e) => this.setState({host: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Port</label>
                <input
                  type="text"
                  name="port"
                  value={this.state.port || ""}
                  onChange={(e) => this.setState({port: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>User</label>
                <input
                  type="text"
                  name="user"
                  value={this.state.user || ""}
                  onChange={(e) => this.setState({user: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Pass</label>
                <input
                  type="password"
                  name="pass"
                  value={this.state.pass || ""}
                  onChange={(e) => this.setState({pass: e.currentTarget.value})}
                />
              </div>
              <button
                disabled={this.state.isConnecting}
                type="submit"
                className="button"
              >
                {this.state.isConnecting ? "Connecting..." : "Connect"}
              </button>
              {this.state.error ? (
                <p className="form-error">{this.state.error.message()}</p>
              ) : null}
            </form>
          </div>
        </div>
      </main>
    )
  }
}

const stateToProps = (state) => ({
  credentials: getCredentials(state)
})

const dispatchToProps = (dispatch) => ({
  ...bindActionCreators({setBoomdCredentials, connectBoomd}, dispatch),
  dispatch
})

export const XConnect = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Connect)
