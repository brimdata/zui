import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import Settings from "../components/Settings"
import * as actions from "../actions/view"
import {getTimeZone} from "../reducers/view"

const stateToProps = state => ({
  timeZone: getTimeZone(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(Settings)
