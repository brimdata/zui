import {connect} from "react-redux"
import FilterTree from "../components/FilterTree"
import {getFilterTree} from "../reducers/filterTree"
import * as actions from "../actions"
import {getSearchBarPins} from "../reducers/searchBar"
import {setSearchBarPins} from "../actions/searchBar"

function stateToProps(state) {
  return {
    filterTree: getFilterTree(state),
    pinnedFilters: getSearchBarPins(state)
  }
}

function dispatchToProps(dispatch) {
  return {
    setSearchBarPins: pinned => dispatch(setSearchBarPins(pinned)),
    fetch: () => dispatch(actions.fetchMainSearch({saveToHistory: false}))
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(FilterTree)
