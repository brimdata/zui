/* @flow */

import {connect} from "react-redux"
import * as searchBar from "../selectors/searchBar"
import * as timeWindow from "../reducers/timeWindow"
import * as spaces from "../reducers/spaces"
import * as boomd from "../reducers/boomdCredentials"
import CurlModal from "../components/CurlModal"

const stateToProps = state => ({
  program: searchBar.getSearchProgram(state),
  space: spaces.getCurrentSpaceName(state),
  timeWindow: timeWindow.getTimeWindow(state),
  credentials: boomd.getCredentials(state)
})

export default connect(stateToProps)(CurlModal)
