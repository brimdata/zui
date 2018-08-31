import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import LogDetail from "../components/LogDetail"
import {
  buildLogDetail,
  buildCorrelatedLogs,
  getNextExists,
  getPrevExists,
  getLogDetailIsStarred
} from "../reducers/logDetails"
import * as actions from "../actions/logDetails"
import * as starActions from "../actions/starredLogs"

const stateToProps = state => ({
  log: buildLogDetail(state),
  correlatedLogs: buildCorrelatedLogs(state),
  prevExists: getPrevExists(state),
  nextExists: getNextExists(state),
  isStarred: getLogDetailIsStarred(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators({...actions, ...starActions}, dispatch)
)(LogDetail)
