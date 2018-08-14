import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import SearchBarInput from "../components/SearchBarInput"
import {getSearchBarInputValue} from "../reducers/searchBar"
import {getMainSearchIsFetching} from "../selectors/mainSearch"
import * as searchActions from "../actions/searchBar"
import * as fetchActions from "../actions/fetchMainSearch"

const actions = {...fetchActions, ...searchActions}

const stateToProps = state => ({
  inputValue: getSearchBarInputValue(state),
  isFetching: getMainSearchIsFetching(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(SearchBarInput)
