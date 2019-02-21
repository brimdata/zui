/* @flow */

import React from "react"
import {PaneHeader, Center, Left, Right, PaneTitle} from "./Pane"
import {disconnect} from "../actions/disconnect"
import {connect} from "react-redux"
import {getBoomHost, getBoomPort} from "../reducers/boomd"
import dispatchToProps from "../lib/dispatchToProps"
import {Link} from "react-router-dom"

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
        <PaneHeader>
          <Left />
          <Center>
            <PaneTitle>
              <Link to="/connect" className="link" onClick={this.onHostClick}>
                {host}:{port}
              </Link>
            </PaneTitle>
          </Center>
          <Right />
        </PaneHeader>
      </div>
    )
  }
}

const stateToProps = state => ({
  host: getBoomHost(state),
  port: getBoomPort(state)
})

export const XTitleBar = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(TitleBar)
