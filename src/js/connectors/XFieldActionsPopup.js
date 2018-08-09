import {connect} from "react-redux"
import FieldActionsPopup from "../components/FieldActionsPopup"
import * as actions from "../actions"

function stateToProps(_state) {
  return {}
}

export function dispatchToProps(dispatch) {
  return {
    appendMainSearchQueryProgram: fragment => {
      dispatch(actions.appendMainSearchQueryProgram(fragment))
      dispatch(actions.fetchMainSearch())
    }
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(FieldActionsPopup)
