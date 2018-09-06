import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import CountByTime from "../components/CountByTime"
import * as actions from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"
import {
  getMainSearchCountByTime,
  getCountByTimeIsFetching
} from "../reducers/countByTime"
import {getMainSearchIsFetching} from "../reducers/mainSearch"
import {getTimeWindow} from "../reducers/timeWindow"

function stateToProps(state) {
  return {
    isFetching: getCountByTimeIsFetching(state),
    ...getMainSearchCountByTime(state),
    timeWindow: getTimeWindow(state)
  }
}

export default connect(
  stateToProps,
  dispatch => bindActionCreators({...actions, fetchMainSearch}, dispatch)
)(CountByTime)
