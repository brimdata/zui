/* @flow */

import {Redirect} from "react-router-dom"
import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import React from "react"

import type {Credentials} from "../lib/Credentials"
import {checkLookytalkVersion} from "../state/thunks/boomd"
import {fetchSpaces} from "../backend/fetch"
import {getCredentials} from "../state/reducers/boomd"
import {setAppMenu} from "../electron/setAppMenu"
import {setBoomdCredentials} from "../state/actions"
import {trim} from "../lib/Str"
import {updateBoomOptions} from "../backend/options"
import AdminTitle from "./AdminTitle"
import AppError from "../models/AppError"
import BoomRequest from "../BoomClient/lib/BoomRequest"
import ErrorFactory from "../models/ErrorFactory"
import LookyHeader from "./LookyHeader"
import delay from "../lib/delay"

type Props = {|
  credentials: Credentials,
  setBoomdCredentials: Function,
  connectBoomd: Function,
  dispatch: Function
|}

type CompState = {|
  ...$Exact<Credentials>,
  error: ?AppError,
  isConnected: boolean,
  isConnecting: boolean,
  request: ?BoomRequest
|}

export default class Login extends React.Component<Props, CompState> {
  constructor(props: Props) {
    setAppMenu("LOGIN")
    super(props)
    this.state = {
      ...props.credentials,
      error: null,
      isConnecting: false,
      isConnected: false,
      request: null
    }
  }

  onSubmit = (e: Event) => {
    e.preventDefault()
    const {host, port} = this.state

    if (!trim(host) || !trim(port)) {
      this.setState({error: ErrorFactory.create("Host and port are required.")})
      return
    }

    this.setState({isConnecting: true, error: null})
    e.preventDefault()

    this.props.setBoomdCredentials(this.state)
    this.props.dispatch(updateBoomOptions())

    let request = this.props.dispatch(fetchSpaces())

    request
      .done(() => {
        setTimeout(() => this.props.dispatch(checkLookytalkVersion()), 3000)
        delay(300, () => this.setState({isConnected: true}))
      })
      .error((e) => {
        delay(300, () =>
          this.setState({
            isConnecting: false,
            error: ErrorFactory.create(e)
          })
        )
      })
      .onAbort(() => {
        this.setState({isConnecting: false})
      })

    this.setState({request})
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
              <div className="status-message">
                {this.state.isConnecting ? (
                  <ConnectingMessage
                    onCancel={() => {
                      this.state.request && this.state.request.abort()
                    }}
                  />
                ) : null}
                {this.state.error ? (
                  <p className="form-error">{this.state.error.message()}</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }
}

function ConnectingMessage({onCancel}) {
  return (
    <p>
      Connecting to boom...<a onClick={onCancel}>Cancel</a>
    </p>
  )
}

const stateToProps = (state) => ({
  credentials: getCredentials(state)
})

const dispatchToProps = (dispatch) => ({
  ...bindActionCreators({setBoomdCredentials}, dispatch),
  dispatch
})

export const XLogin = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Login)
