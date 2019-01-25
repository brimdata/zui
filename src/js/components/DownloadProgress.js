/* @flow */

import React from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import * as packets from "../reducers/packets"
import * as view from "../reducers/view"
import {type State} from "../reducers/types"
import {type Dispatch} from "../reducers/types"

type Props = {
  downloads: *[],
  downloadsIsOpen: boolean
}

export default class DownloadProgress extends React.Component<Props> {
  render() {
    const {downloads, downloadsIsOpen} = this.props
    if (!downloadsIsOpen || downloads.length === 0) return null

    const {percentComplete, error} = downloads[0]
    const complete = percentComplete >= 1

    return (
      <div
        className={classNames("download-progress", {
          complete,
          error: error
        })}
      >
        <div className="message-wrapper">
          <p className="message">{message({complete, error})}</p>
        </div>

        <div className="progress-bar">
          <div
            className="progress-value"
            style={{width: percentComplete * 100 + "%"}}
          />
        </div>
      </div>
    )
  }
}

const message = ({complete, error}) =>
  error
    ? `Download error: ${error}`
    : complete
    ? "Download Complete"
    : "Downloading"

const stateToProps = (state: State) => ({
  downloads: packets.getDownloads(state),
  downloadsIsOpen: view.getDownloadsIsOpen(state)
})

export const XDownloadProgress = connect<
  Props,
  {},
  _,
  {dispatch: Dispatch},
  _,
  _
>(stateToProps)(DownloadProgress)
