/* @flow */

import {connect} from "react-redux"
import SearchBar from "../components/SearchBar"
import {getSearchBarError} from "../selectors/searchBar"

const stateToProps = state => ({
  error: getSearchBarError(state)
})

export default connect(stateToProps)(SearchBar)
