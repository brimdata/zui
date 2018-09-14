import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/timeWindow"
import {submitSearchBar} from "../actions/searchBar"
import TimeWindowInput from "../components/TimeWindowInput"
import {getTimeWindow} from "../reducers/timeWindow"
import {getTimeZone} from "../reducers/view"

const stateToProps = state => ({
  timeWindow: getTimeWindow(state),
  timeZone: getTimeZone(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators({...actions, submitSearchBar}, dispatch)
)(TimeWindowInput)
