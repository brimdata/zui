import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import LogViewer from "../components/LogViewer"
import {setLogDetail, logDetailsRequested} from "../actions/logDetails"
import {appendMainSearchQueryProgram} from "../actions/mainSearch"
import {fetchMainSearch} from "../actions/mainSearch"
import {getLogs} from "../selectors/mainSearch"
import queryActions from "../actions/query"

const stateToProps = state => ({
  logs: getLogs(state)
})

const dispatchToProps = dispatch => ({
  showDetail(log) {
    dispatch(setLogDetail(log))
    const uid = log.cast("uid")
    if (uid) dispatch(logDetailsRequested(uid))
  },

  appendToQuery(fragment) {
    dispatch(appendMainSearchQueryProgram(fragment))
    dispatch(fetchMainSearch())
  }
})

export default connect(
  stateToProps,
  dispatchToProps
)(LogViewer)
