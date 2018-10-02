import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import DownloadProgress from "../components/DownloadProgress"
import * as actions from "../actions/packets"
import * as packets from "../reducers/packets"

const stateToProps = state => ({
  downloads: packets.getDownloads(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(DownloadProgress)
