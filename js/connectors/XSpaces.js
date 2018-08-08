import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import Spaces from "../components/Spaces"
import {getSpaces} from "../reducers/spaces"
import * as actions from "../actions/spaces"

const stateToProps = state => ({
  spaces: getSpaces(state)
})

const dispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Spaces)
