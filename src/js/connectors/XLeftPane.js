import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import LeftPane from "../components/LeftPane"
import * as viewActions from "../actions/view"
import * as view from "../reducers/view"
import * as filterTreeActions from "../actions/filterTree"

const stateToProps = state => ({
  isOpen: view.getLeftSidebarIsOpen(state),
  width: view.getLeftSidebarWidth(state)
})

export default connect(
  stateToProps,
  dispatch =>
    bindActionCreators({...viewActions, ...filterTreeActions}, dispatch)
)(LeftPane)
