import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/spaces"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getBoomdIsConnected} from "../reducers/boomdConnection"
import Search from "../components/Search"

function stateToProps(state) {
  return {
    isConnected: getBoomdIsConnected(state),
    currentSpaceName: getCurrentSpaceName(state)
  }
}

const dispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(Search)
