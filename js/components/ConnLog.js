import React from "react"
import ConnVersation from "./ConnVersation"
import UidWaterfall from "./UidWaterfall"
import BroLogRawFields from "./BroLogRawFields"

export default class ConnLog extends React.Component {
  render() {
    return (
      <div className="bro-log-details conn">
        <h3 className="medium-heading">Log Details</h3>

        <div className="detail-body">
          <BroLogRawFields broLog={this.props.broLog} />

          <section className="vizualization-section">
            <ConnVersation broLog={this.props.broLog} />
            <UidWaterfall
              broLog={this.props.broLog}
              broLogs={this.props.correlatedEvents}
              showModal={this.props.showModal}
            />
          </section>
        </div>
      </div>
    )
  }
}
