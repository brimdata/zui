/* @flow */

import {connect} from "react-redux"
import type {Dispatch} from "redux"
import LogCellActions from "../components/LogCellActions"

const dispatchToProps = (dispatch: Dispatch<any>) => ({dispatch})

export default connect(
  null,
  dispatchToProps
)(LogCellActions)
