import React from "react"
import BroLogRawFields from "./BroLogRawFields"

export default class BasicLog extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {broLog} = this.props

    return (
      <div className="bro-log-details">
        <h3 className="medium-heading">Log Details</h3>
        <div className="detail-body">
          <BroLogRawFields broLog={broLog} />

          <section className="vizualization-section" />
        </div>
      </div>
    )
  }
}
