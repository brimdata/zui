/* @flow */

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import DownloadProgress from "../components/DownloadProgress"
import * as actions from "../actions/packets"
import * as packets from "../reducers/packets"
import * as view from "../reducers/view"

const stateToProps = state => ({
  downloads: packets.getDownloads(state),
  downloadsIsOpen: view.getDownloadsIsOpen(state)
})

export default connect(
  stateToProps,
  (dispatch: Function) => bindActionCreators(actions, dispatch)
)(DownloadProgress)
