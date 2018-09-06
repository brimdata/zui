import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import SearchInput from "../components/SearchInput"
import {getSearchBarInputValue} from "../reducers/searchBar"
import * as actions from "../actions/searchBar"

const stateToProps = state => ({
  inputValue: getSearchBarInputValue(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchInput)
