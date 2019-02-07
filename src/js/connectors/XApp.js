import {connect} from "react-redux"
import {withRouter} from "react-router"
import {getTimeZone} from "../reducers/view"
import App from "../components/App"

const stateToProps = state => ({
  timeZone: getTimeZone(state)
})

export default withRouter(connect(stateToProps)(App))
