import {connect} from "react-redux"
import {withRouter} from "react-router"
import {getBoomdIsConnected} from "../reducers/boomdConnection"
import {getTimeZone} from "../reducers/view"
import App from "../components/App"

const stateToProps = state => ({
  isConnected: getBoomdIsConnected(state),
  timeZone: getTimeZone(state)
})

export default withRouter(connect(stateToProps)(App))
