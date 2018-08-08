import {connect} from "react-redux"
import CountByTime from "../components/CountByTime"
import * as selectors from "../selectors"

function stateToProps(state) {
  return {
    ...selectors.getMainSearchCountByTime(state),
    timeWindow: selectors.getTimeWindow(state),
    interval: selectors.getMainSearchCountByTimeInterval(state)
  }
}

function dispatchToProps(_dispatch) {
  return {}
}

export default connect(
  stateToProps,
  dispatchToProps
)(CountByTime)
