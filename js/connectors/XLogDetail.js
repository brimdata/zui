import {connect} from "react-redux"
import LogDetail from "../components/LogDetail"
import {unsetLogDetail} from "../actions/logDetails"
import {buildLogDetail, buildCorrelatedLogs} from "../reducers/logDetail"

const stateToProps = state => ({
  log: buildLogDetail(state),
  correlatedLogs: buildCorrelatedLogs(state)
})

const dispatchToProps = dispatch => ({
  close() {
    dispatch(unsetLogDetail())
  }
})

export default connect(
  stateToProps,
  dispatchToProps
)(LogDetail)
