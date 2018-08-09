import React from "react"
import UidWaterfall from "./UidWaterfall"
import BroLogRawFields from "./BroLogRawFields"
import OriginatorResponder from "./OriginatorResponder"

export default class GenericLog extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {broLog} = this.props

    return (
      <div className="bro-log-details generic">
        <h3 className="medium-heading">Log Details</h3>
        <div className="detail-body">
          <BroLogRawFields broLog={broLog} />

          <section className="vizualization-section">
            <OriginatorResponder broLog={broLog} />
            <UidWaterfall
              broLog={broLog}
              broLogs={this.props.correlatedEvents}
              showModal={this.props.showModal}
            />
          </section>
        </div>
      </div>
    )
  }
}
