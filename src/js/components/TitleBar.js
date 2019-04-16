/* @flow */

import {Link} from "react-router-dom"
import {connect} from "react-redux"
import React from "react"

import {disconnect} from "../state/actions/disconnect"
import {getBoomHost, getBoomPort} from "../state/reducers/boomd"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {|
  host: string,
  port: string,
  dispatch: Function
|}

export default class TitleBar extends React.Component<Props> {
  onHostClick = () => this.props.dispatch(disconnect())

  render() {
    const {host, port} = this.props
    return (
      <div className="title-bar">
        <Link
          to="/connect"
          className="thin-button host"
          onClick={this.onHostClick}
        >
          {host}:{port}
        </Link>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  host: getBoomHost(state),
  port: getBoomPort(state)
})

export const XTitleBar = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(TitleBar)
