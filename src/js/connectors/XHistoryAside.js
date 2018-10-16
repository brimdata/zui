import {connect} from "react-redux"
import HistoryAside from "../components/HistoryAside"
import * as actions from "../actions/filterTree"

function dispatchToProps(dispatch) {
  return {
    clearFilterTree: () => dispatch(actions.clearFilterTree())
  }
}

export default connect(
  null,
  dispatchToProps
)(HistoryAside)
