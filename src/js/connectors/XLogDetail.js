import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import LogDetail from "../components/LogDetail"
import {buildLogDetail, buildCorrelatedLogs} from "../reducers/logDetails"
import * as actions from "../actions/logDetails"

const stateToProps = state => ({
  log: buildLogDetail(state),
  correlatedLogs: buildCorrelatedLogs(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(LogDetail)
