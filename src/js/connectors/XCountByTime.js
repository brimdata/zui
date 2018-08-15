import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import CountByTime from "../components/CountByTime"
import * as actions from "../actions/searchBar"
import * as selectors from "../selectors"

function stateToProps(state) {
  return {
    ...selectors.getMainSearchCountByTime(state),
    timeWindow: selectors.getTimeWindow(state),
    interval: selectors.getMainSearchCountByTimeInterval(state)
  }
}

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(CountByTime)
