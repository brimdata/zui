/* @flow */

import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import Notice from "../components/Notice"
import * as notices from "../reducers/notices"
import {dismissNotice} from "../actions/notices"
import type {Dispatch} from "redux"
import type {State} from "../reducers/types"

const stateToProps = (state: State) => ({
  message: notices.getError(state)
})

const dispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators({dismissNotice}, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Notice)
