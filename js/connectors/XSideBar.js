import SideBar from "../components/SideBar"
import {connect} from "react-redux/dist/react-redux"
import * as actions from "../actions"

function stateToProps(state) {
  return {
    isOpen: state.sideBar.isOpen,
    currentSpaceName: state.currentSpaceName
  }
}

function dispatchToProps(dispatch) {
  return {
    closeSideBar: () => {
      dispatch(actions.closeSideBar())
    },
    openSideBar: () => {
      dispatch(actions.openSideBar())
    }
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(SideBar)
