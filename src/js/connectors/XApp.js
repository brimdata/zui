import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {withRouter} from "react-router"
import * as actions from "../actions/boomd"
import App from "../components/App"

export default withRouter(
  connect(
    null,
    dispatch => bindActionCreators(actions, dispatch)
  )(App)
)
