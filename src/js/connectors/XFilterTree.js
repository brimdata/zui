import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {getSearchBarPins} from "../reducers/searchBar"
import {getFilterTree} from "../reducers/filterTree"
import * as mainSearchActions from "../actions/mainSearch"
import * as filterTreeActions from "../actions/filterTree"
import * as searchBarActions from "../actions/searchBar"
import FilterTree from "../components/FilterTree"

function stateToProps(state) {
  return {
    filterTree: getFilterTree(state),
    pinnedFilters: getSearchBarPins(state)
  }
}

export default connect(
  stateToProps,
  dispatch =>
    bindActionCreators(
      {
        ...mainSearchActions,
        ...filterTreeActions,
        ...searchBarActions
      },
      dispatch
    )
)(FilterTree)
