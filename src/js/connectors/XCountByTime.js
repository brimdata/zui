import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import CountByTime from "../components/CountByTime"
import * as actions from "../actions/searchBar"
import * as selectors from "../selectors"
import {getMainSearchIsFetching} from "../selectors/mainSearch"

function stateToProps(state) {
  return {
    isFetching: getMainSearchIsFetching(state),
    ...selectors.getMainSearchCountByTime(state),
    timeWindow: selectors.getTimeWindow(state),
    interval: selectors.getMainSearchCountByTimeInterval(state)
  }
}

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(CountByTime)
