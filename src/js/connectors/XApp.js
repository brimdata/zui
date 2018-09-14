import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {withRouter} from "react-router"
import * as actions from "../actions/boomd"
import {getBoomdIsConnected} from "../reducers/boomdConnection"
import {getTimeZone} from "../reducers/view"
import App from "../components/App"

const stateToProps = state => ({
  isConnected: getBoomdIsConnected(state),
  timeZone: getTimeZone(state)
})

export default withRouter(
  connect(
    stateToProps,
    dispatch => bindActionCreators(actions, dispatch)
  )(App)
)
