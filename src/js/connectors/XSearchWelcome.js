import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import SearchWelcome from "../components/SearchWelcome"
import {getCurrentSpace} from "../reducers/spaces"
import * as actions from "../actions/spaces"

const stateToProps = state => ({
  space: getCurrentSpace(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchWelcome)
