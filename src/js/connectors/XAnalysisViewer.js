/* @flow */

import {connect} from "react-redux"

import type {State} from "../reducers/types"
import {getAnalysis} from "../reducers/analysis"
import {getMainSearchIsFetching} from "../selectors/boomSearches"
import AnalysisViewer from "../components/AnalysisViewer"

const stateToProps = (state: State) => ({
  analysis: getAnalysis(state),
  isFetching: getMainSearchIsFetching(state)
})

// $FlowFixMe
export default connect(stateToProps)(AnalysisViewer)
