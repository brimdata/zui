/* @flow */

import {connect} from "react-redux"
import SearchWelcome from "../components/SearchWelcome"
import {getCurrentSpace} from "../reducers/spaces"
import {type State} from "../reducers/types"

type SP = {|space: string|}
const stateToProps = (state: State): SP => ({
  space: getCurrentSpace(state)
})

export default connect<SP, {}, _, _, _, _>(stateToProps)(SearchWelcome)
