import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as queryActions from "../actions/query"
import LogCell from "../components/LogCell"

export default connect(
  null,
  dispatch => bindActionCreators(queryActions, dispatch)
)(LogCell)
