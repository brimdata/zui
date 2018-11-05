/* @flow */

import {connect} from "react-redux"
import SearchWelcome from "../components/SearchWelcome"
import {getCurrentSpace} from "../reducers/spaces"

const stateToProps = state => ({
  space: getCurrentSpace(state)
})

export default connect(stateToProps)(SearchWelcome)
