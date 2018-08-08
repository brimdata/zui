import React from "react"
import * as d3 from "d3"
import config from "../config"
import moment from "moment"
import Modal from "./Modal"
import BroLogDetail from "./BroLogDetail"

export default class UidWaterfall extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  showBroLog(log) {
    this.setState({
      selectedBroLog: log
    })
  }

  row(broLog, index, xScale) {
    const position = xScale(broLog.cast("ts").toDate())
    const isCurrent = broLog.isEqual(this.props.broLog)
    return (
      <div key={index} className="waterfall-row">
        <div className="ts-label">
          {broLog.cast("ts").format(config.TIME_MOMENT_FORMAT)}
        </div>
        <div className="slider">
          <div className="line" />
          <span
            className={`path-tag ${broLog.get("_path")}-bg-color ${
              isCurrent ? "current" : ""
            }`}
            style={{left: position + "%"}}
            onClick={_e => this.showBroLog(broLog)}
          >
            {broLog.get("_path")}
          </span>
        </div>
      </div>
    )
  }

  render() {
    if (this.props.broLogs.length === 0) return null

    const extent = d3.extent(this.props.broLogs.map(l => l.cast("ts").toDate()))
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([0, 100])

    const duration = moment(extent[1]).diff(moment(extent[0]), "seconds", true)

    return (
      <div className="uid-waterfall panel">
        <h4 className="panel-heading">Correlated Logs</h4>
        {this.props.broLogs.map((log, i) => this.row(log, i, xScale))}
        <p className="duration">Duration: {duration}s</p>

        <Modal
          extraClasses="bro-log-detail-modal"
          isOpen={!!this.state.selectedBroLog}
          onDismiss={() => this.setState({selectedBroLog: null})}
        >
          <BroLogDetail
            broLog={this.state.selectedBroLog}
            correlatedEvents={this.props.broLogs}
          />
        </Modal>
      </div>
    )
  }
}
