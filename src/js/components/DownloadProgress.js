import React from "react"
import classNames from "classnames"

class DownloadProgress extends React.Component {
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

export default DownloadProgress
