import {connect} from "react-redux"
import LogViewer from "../components/LogViewer"
import {getLogs} from "../reducers/mainSearch"
import {buildLogDetail} from "../reducers/logDetails"
import {getTimeZone} from "../reducers/view"

const stateToProps = state => ({
  logs: getLogs(state),
  logDetail: buildLogDetail(state),
  timeZone: getTimeZone(state)
})

export default connect(
  stateToProps,
  null
)(LogViewer)
