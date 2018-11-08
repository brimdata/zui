import React from "react"
import {Redirect} from "react-router-dom"
import Input from "./Input"
import LookyHeader from "./LookyHeader"
import AdminTitle from "./AdminTitle"

class Connect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props.credentials}
    this.isSubmitting = false

    this.onSubmit = e => {
      this.isSubmitting = true
      e.preventDefault()
      this.props.setBoomdCredentials(this.state)
      this.props.connectBoomd()
    }
  }

  render() {
    const {error, isConnected} = this.props
    const {isSubmitting} = this

    if (isSubmitting && isConnected) return <Redirect to="/search" />

    return (
      <main className="admin-page boomd-connect">
        <LookyHeader />
        <AdminTitle title="Connect To Boom" />

        <div className="admin-panel-wrapper">
          <div className="admin-panel">
            <form className="admin-form" onSubmit={this.onSubmit}>
              <div className="form-field">
                <label>Host</label>
                <Input
                  autoFocus
                  type="text"
                  name="host"
                  value={this.state.host || ""}
                  onChange={e => this.setState({host: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Port</label>
                <Input
                  type="text"
                  name="port"
                  value={this.state.port || ""}
                  onChange={e => this.setState({port: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>User</label>
                <Input
                  type="text"
                  name="user"
                  value={this.state.user || ""}
                  onChange={e => this.setState({user: e.currentTarget.value})}
                />
              </div>
              <div className="form-field">
                <label>Pass</label>
                <Input
                  type="password"
                  name="pass"
                  value={this.state.pass || ""}
                  onChange={e => this.setState({pass: e.currentTarget.value})}
                />
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <button type="submit" className="button">
                Connect
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }
}

export default Connect
