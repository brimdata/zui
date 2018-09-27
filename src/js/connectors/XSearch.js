import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as spaceActions from "../actions/spaces"
import * as viewActions from "../actions/view"
import * as spaces from "../reducers/spaces"
import * as boomdConnection from "../reducers/boomdConnection"
import * as view from "../reducers/view"
import * as initialLoad from "../reducers/initialLoad"
import Search from "../components/Search"

const stateToProps = state => ({
  initialLoad: initialLoad.getInitialLoad(state),
  isConnected: boomdConnection.getBoomdIsConnected(state),
  currentSpaceName: spaces.getCurrentSpaceName(state),
  logsTab: view.getShowLogsTab(state),
  analyticsTab: view.getShowAnalyticsTab(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators({...spaceActions, ...viewActions}, dispatch)
)(Search)
