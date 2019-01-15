/* @flow */

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/searchBar"
import {
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  getSearchBarEditingIndex
} from "../selectors/searchBar"
import Pins from "../components/Pins"

const stateToProps = state => ({
  pins: getSearchBarPins(state),
  previousValue: getSearchBarPreviousInputValue(state),
  editing: getSearchBarEditingIndex(state)
})

export default connect(
  stateToProps,
  // $FlowFixMe
  (dispatch: Function) => bindActionCreators(actions, dispatch)
)(Pins)
