import React from "react"
import {Link} from "react-router-dom"

export default class TitleBar extends React.Component {
  render() {
    const {host, port, space, disconnectBoomd} = this.props

    return (
      <div className="title-bar">
        <Link to="/connect" onClick={disconnectBoomd}>
          {host}:{port}
        </Link>
        <Link to="/spaces">{space}</Link>
      </div>
    )
  }
}
