import React from "react"
import {Redirect} from "react-router-dom"
import LookyHeader from "./LookyHeader"
import AdminTitle from "./AdminTitle"
import ErrorFactory from "../models/ErrorFactory"
import delay from "../lib/delay"

class Connect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.credentials,
      error: null,
      isConnecting: false,
      isConnected: false
    }
    this.onSubmit = e => {
      this.setState({isConnecting: true, error: null})
      e.preventDefault()
      this.props.setBoomdCredentials(this.state)
      this.props
        .connectBoomd()
        .then(() => delay(300, () => this.setState({isConnected: true})))
        .catch(e => {
          delay(300, () =>
            this.setState({
              isConnecting: false,
              error: ErrorFactory.create(e)
            })
          )
        })
    }
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
                  onChange={e => this.setState({host: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Port</label>
                <input
                  type="text"
                  name="port"
                  value={this.state.port || ""}
                  onChange={e => this.setState({port: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>User</label>
                <input
                  type="text"
                  name="user"
                  value={this.state.user || ""}
                  onChange={e => this.setState({user: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Pass</label>
                <input
                  type="password"
                  name="pass"
                  value={this.state.pass || ""}
                  onChange={e => this.setState({pass: e.currentTarget.value})}
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

export default Connect
