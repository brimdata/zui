import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/timeWindow"
import TimeWindowInput from "../components/TimeWindowInput"
import {getTimeWindow} from "../reducers/timeWindow"

const stateToProps = state => ({
  timeWindow: getTimeWindow(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(TimeWindowInput)
