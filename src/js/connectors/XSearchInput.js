import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import SearchInput from "../components/SearchInput"
import {getSearchBarInputValue, getSearchBarError} from "../reducers/searchBar"
import * as actions from "../actions/searchBar"

const stateToProps = state => ({
  inputValue: getSearchBarInputValue(state),
  error: getSearchBarError(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchInput)
