import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/mainSearch"
import SearchButton from "../components/SearchButton"

export default connect(
  null,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchButton)
