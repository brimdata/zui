import {connect} from "react-redux"
import LogViewer from "../components/LogViewer"
import {viewLogDetail, fetchCorrelatedLogs} from "../actions/logDetails"
import {appendMainSearchQueryProgram} from "../actions/mainSearch"
import {fetchMainSearch} from "../actions/mainSearch"
import {getLogs} from "../reducers/mainSearch"
import {setTimeCursor} from "../actions/countByTime"

const stateToProps = state => ({
  logs: getLogs(state)
})

const dispatchToProps = dispatch => ({
  showDetail(log) {
    dispatch(viewLogDetail(log))
    const uid = log.cast("uid")
    if (uid) dispatch(fetchCorrelatedLogs(uid))
  },

  appendToQuery(fragment) {
    dispatch(appendMainSearchQueryProgram(fragment))
    dispatch(fetchMainSearch())
  },

  setTimeCursor: date => dispatch(setTimeCursor(date))
})

export default connect(
  stateToProps,
  dispatchToProps
)(LogViewer)
