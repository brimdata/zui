import React from "react"
import classNames from "classnames"

class DownloadProgress extends React.Component {
  render() {
    const {downloads, downloadsIsOpen} = this.props
    if (!downloadsIsOpen || downloads.length === 0) return null

    const {percentComplete} = downloads[0]
    const complete = percentComplete >= 1

    return (
      <div
        className={classNames("download-progress", {
          complete
        })}
      >
        {!complete && (
          <div className="message-wrapper">
            <p className="message">Downloading</p>
          </div>
        )}
        {complete && (
          <div className="message-wrapper">
            <p className="message">Download Complete</p>
          </div>
        )}

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

export default DownloadProgress
