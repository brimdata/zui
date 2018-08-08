import {connect} from "react-redux"
import {getSearchStats} from "../reducers/searchStats"
import SearchStats from "../components/SearchStats"

const stateToProps = state => ({
  ...getSearchStats(state)
})

export default connect(stateToProps)(SearchStats)
