import React from "react"
import PropTypes from "prop-types"
import RawFieldTableRow from "./RawFieldTableRow"

export default class BroLogRawFields extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: null
    }
  }

  render() {
    return (
      <section className="raw-fields-section" style={{position: "relative"}}>
        <table className="fields-table">
          <tbody>
            {this.props.broLog
              .fieldNames()
              .map(fieldName => (
                <RawFieldTableRow
                  key={fieldName}
                  field={this.props.broLog.getField(fieldName)}
                />
              ))}
          </tbody>
        </table>
      </section>
    )
  }
}

BroLogRawFields.propTypes = {
  broLog: PropTypes.object.isRequired
}
