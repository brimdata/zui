import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import CountByTime from "../components/CountByTime"
import * as actions from "../actions/searchBar"
import {getMainSearchCountByTime} from "../reducers/countByTime"
import {getMainSearchIsFetching} from "../selectors/mainSearch"
import {getTimeWindow} from "../reducers/timeWindow"

function stateToProps(state) {
  return {
    isFetching: getMainSearchIsFetching(state),
    ...getMainSearchCountByTime(state),
    timeWindow: getTimeWindow(state)
  }
}

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(CountByTime)
