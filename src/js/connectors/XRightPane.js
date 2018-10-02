import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import RightPane from "../components/RightPane"
import * as viewActions from "../actions/view"
import * as starActions from "../actions/starredLogs"
import * as detailActions from "../actions/logDetails"
import * as packetActions from "../actions/packets"
import * as view from "../reducers/view"
import * as logDetails from "../reducers/logDetails"

const stateToProps = state => ({
  isOpen: view.getRightSidebarIsOpen(state),
  width: view.getRightSidebarWidth(state),
  prevExists: logDetails.getPrevExists(state),
  nextExists: logDetails.getNextExists(state),
  isStarred: logDetails.getLogDetailIsStarred(state),
  currentLog: logDetails.buildLogDetail(state)
})

export default connect(
  stateToProps,
  dispatch =>
    bindActionCreators(
      {...viewActions, ...starActions, ...detailActions, ...packetActions},
      dispatch
    )
)(RightPane)
