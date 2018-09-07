import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/searchBar"
import SearchButton from "../components/SearchButton"
import {getSearchProgram, getAst} from "../reducers/searchBar"

const stateToProps = state => ({
  ast: getAst(state),
  searchProgram: getSearchProgram(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchButton)
