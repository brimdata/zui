import {connect} from "react-redux"
import TimeControls from "../components/TimeControls"
import * as selectors from "../selectors"
import * as actions from "../actions"

function stateToProps(state) {
  return {
    timeWindow: selectors.getTimeWindow(state),
    reducerProgram: selectors.getCountByTimeProc(state),
    countByDataPresent: selectors.getCountByTimeData(state).length > 1
  }
}

function dispatchToProps(dispatch) {
  return {
    setTimeWindow: timeWindow => {
      dispatch(actions.setTimeWindow(timeWindow))
    },
    fetch: () => {
      dispatch(actions.fetchMainSearch())
    }
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(TimeControls)
