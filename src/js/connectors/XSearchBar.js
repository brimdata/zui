import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import SearchBar from "../components/SearchBar"
import * as actions from "../actions"
import * as selectors from "../selectors"
import {
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  getSearchBarEditingIndex
} from "../reducers/searchBar"
import * as searchBarActions from "../actions/searchBar"

function stateToProps(state) {
  return {
    inputValue: getSearchBarInputValue(state),
    pins: getSearchBarPins(state),
    previousValue: getSearchBarPreviousInputValue(state),
    editing: getSearchBarEditingIndex(state),
    isFetching: selectors.getMainSearchIsFetching(state)
  }
}

function dispatchToProps(dispatch) {
  return {
    ...bindActionCreators(searchBarActions, dispatch),
    fetch: options => dispatch(actions.fetchMainSearch(options))
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(SearchBar)
