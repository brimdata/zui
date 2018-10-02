import React from "react"
import classNames from "classnames"

class DownloadProgress extends React.Component {
  render() {
    const {percent, fileName} = this.props
    const complete = percent >= 100

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
          <div className="progress-value" style={{width: percent + "%"}} />
        </div>
      </div>
    )
  }
}

export default DownloadProgress
