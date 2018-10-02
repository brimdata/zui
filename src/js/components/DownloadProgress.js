import React from "react"
import classNames from "classnames"

class DownloadProgress extends React.Component {
  render() {
    const {downloads} = this.props
    const item = downloads[0]
    if (!item) return null

    const {percentComplete, fileName} = downloads[0]
    console.log(percentComplete)
    const complete = percentComplete >= 1

    return (
      <div
        className={classNames("download-progress", {
          complete
        })}
      >
        {!complete && (
          <div className="message-wrapper">
            <p className="message">
              Downloading <b>{fileName}</b>
            </p>
            <button className="panel-button text cancel">CANCEL</button>
          </div>
        )}
        {complete && (
          <div className="message-wrapper">
            <p className="message">
              Download Complete: <b>{fileName}</b>
            </p>
            <button className="panel-button text open">OPEN</button>
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
