/* @flow */

import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import LogCellActions from "../components/LogCellActions"
import type {Dispatch} from "redux"
import * as actions from "../actions/searchBar"

const dispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(actions, dispatch)

export default connect(
  null,
  dispatchToProps
)(LogCellActions)
