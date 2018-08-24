import {connect} from "react-redux"
import AnalysisViewer from "../components/AnalysisViewer"
import {getAnalysis} from "../reducers/analysis"
import {getMainSearchIsFetching} from "../reducers/mainSearch"

const stateToProps = state => ({
  analysis: getAnalysis(state),
  isFetching: getMainSearchIsFetching(state)
})

export default connect(stateToProps)(AnalysisViewer)
