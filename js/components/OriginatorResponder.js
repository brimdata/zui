import React from "react"

export default class OriginatorResponder extends React.Component {
  render() {
    const broLog = this.props.broLog
    return (
      <div
        className="originator-responder"
        style={{position: "relative"}}
        ref={r => (this.node = r)}
      >
        <div className="panel originator">
          <h4 className="panel-heading">Originator</h4>
          <div className="ip-address-originator">
            <span className="host">{broLog.get("id.orig_h")}</span>
            <span className="port">{broLog.get("id.orig_p")}</span>
          </div>
        </div>
        <div className="arrow-right">
          <hr />
          <svg className="triangle" viewBox="0 0 18 12">
            <polygon points="18 6 0 12 2.66453526e-15 0" />
          </svg>
        </div>
        <div className="panel responder">
          <h4 className="panel-heading">Responder</h4>
          <div className="ip-address-responder">
            <span className="host">{broLog.get("id.resp_h")}</span>
            <span className="port">{broLog.get("id.resp_p")}</span>
          </div>
        </div>
      </div>
    )
  }
}
