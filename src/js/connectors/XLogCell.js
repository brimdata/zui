import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/searchBar"
import LogCell from "../components/LogCell"

export default connect(
  null,
  dispatch => bindActionCreators(actions, dispatch)
)(LogCell)
