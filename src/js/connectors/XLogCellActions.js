/* @flow */

import {connect} from "react-redux"
import LogCellActions from "../components/LogCellActions"
import * as spaces from "../reducers/spaces"

const stateToProps = state => ({
  space: spaces.getCurrentSpace(state)
})

export default connect(
  stateToProps,
  (dispatch: *) => ({dispatch})
)(LogCellActions)
