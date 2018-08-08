import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {withRouter} from "react-router"
import * as boomdActions from "../actions/boomd"
import * as spaceActions from "../actions/spaces"
import {
  getBoomdIsConnected,
  getBoomdIsConnecting,
  getBoomdError
} from "../reducers/boomdConnection"
import App from "../components/App"

const stateToProps = state => ({
  isConnected: getBoomdIsConnected(state),
  isConnecting: getBoomdIsConnecting(state),
  connectionError: getBoomdError(state)
})

const dispatchToProps = dispatch =>
  bindActionCreators({...boomdActions, ...spaceActions}, dispatch)

export default withRouter(
  connect(
    stateToProps,
    dispatchToProps
  )(App)
)
