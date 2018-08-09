import {connect} from "react-redux"
import SpaceSwitcher from "../components/SpaceSwitcher"
import * as actions from "../actions"

function stateToProps(state) {
  return {
    spaces: state.spaces,
    currentSpaceName: state.currentSpaceName
  }
}

function dispatchToProps(dispatch) {
  return {
    onSelect: value => dispatch(actions.setCurrentSpaceName(value))
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(SpaceSwitcher)
