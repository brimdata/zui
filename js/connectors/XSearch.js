import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import Search from "../components/Search"
import * as actions from "../actions/spaces"
import * as selectors from "../selectors"
import {getBoomdIsConnected} from "../reducers/boomdConnection"

function stateToProps(state) {
  return {
    isConnected: getBoomdIsConnected(state),
    initialLoad: state.initialLoad,
    eventsPresent: selectors.mainSearchEvents(state).length > 0,
    analysisPresent: Object.keys(state.analysis).length > 0,
    query: selectors.getMainSearchQuery(state),
    isFetching: state.mainSearch.isFetching,
    timeWindow: selectors.getTimeWindow(state),
    analysis: state.analysis,
    sideBarIsOpen: state.sideBar.isOpen
  }
}

const dispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Search)
