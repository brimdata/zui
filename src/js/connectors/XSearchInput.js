import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import SearchInput from "../components/SearchInput"
import {getSearchBarInputValue} from "../reducers/searchBar"
import * as searchActions from "../actions/searchBar"
import * as fetchActions from "../actions/mainSearch"

const actions = {...fetchActions, ...searchActions}

const stateToProps = state => ({
  inputValue: getSearchBarInputValue(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchInput)
