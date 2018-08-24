import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/spaces"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getBoomdIsConnected} from "../reducers/boomdConnection"
import {
  getLeftSidebarIsOpen,
  getRightSidebarIsOpen,
  getShowLogsTab,
  getShowAnalyticsTab
} from "../reducers/view"
import {getInitialLoad} from "../reducers/initialLoad"
import Search from "../components/Search"

function stateToProps(state) {
  return {
    initialLoad: getInitialLoad(state),
    leftSidebarIsOpen: getLeftSidebarIsOpen(state),
    rightSidebarIsOpen: getRightSidebarIsOpen(state),
    isConnected: getBoomdIsConnected(state),
    currentSpaceName: getCurrentSpaceName(state),
    showLogsTab: getShowLogsTab(state),
    showAnalyticsTab: getShowAnalyticsTab(state)
  }
}

const dispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Search)
