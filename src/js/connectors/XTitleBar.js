import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import TitleBar from "../components/TitleBar"
import {getBoomHost, getBoomPort} from "../reducers/boomdCredentials"
import {getCurrentSpaceName} from "../reducers/spaces"
import * as actions from "../actions/boomd"

const stateToProps = state => ({
  host: getBoomHost(state),
  port: getBoomPort(state),
  space: getCurrentSpaceName(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(TitleBar)
