import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import Connect from "../components/Connect"
import * as actions from "../actions/boomd"
import {getCredentials} from "../reducers/boomdCredentials"
import {getBoomdError} from "../reducers/boomdConnection"

const stateToProps = state => ({
  credentials: getCredentials(state),
  error: getBoomdError(state)
})

const dispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Connect)
