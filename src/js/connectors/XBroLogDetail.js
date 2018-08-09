import {connect} from "react-redux"
import BroLogDetail from "../components/BroLogDetail"
import * as selectors from "../selectors"
import * as actions from "../actions"
import BroLog from "../models/BroLog"

function stateToProps(state, ownProps) {
  const uid = ownProps.broLog.getField("uid").toString()
  const events = selectors.eventsByUid(state)[uid] || []
  const schemas = state.broSchemas
  const broLogs = BroLog.buildFrom({events, schemas})
    .sort(byPath)
    .sort(byTs)

  return {
    correlatedEvents: broLogs
  }
}

function dispatchToProps(dispatch) {
  return {
    showModal: lineId => dispatch(actions.logDetailModalRequested(lineId)),
    fetchUid: uid => dispatch(actions.logDetailsRequested(uid))
  }
}

const byTs = (a, b) =>
  a.getField("ts").value < b.getField("ts").value ? -1 : 1
const byPath = (a, b) => (a.get("_path") < b.get("_path") ? 1 : -1)

export default connect(
  stateToProps,
  dispatchToProps
)(BroLogDetail)
