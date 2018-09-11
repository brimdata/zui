import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import CountByTime from "../components/CountByTime"
import * as actions from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"
import {
  getMainSearchCountByTime,
  getCountByTimeIsFetching,
  getCountByTimeData,
  getTimeCursor
} from "../reducers/countByTime"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"

const stateToProps = state => ({
  rawData: getCountByTimeData(state),
  isFetching: getCountByTimeIsFetching(state),
  ...getMainSearchCountByTime(state),
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state),
  timeCursor: getTimeCursor(state)
})

export default connect(
  stateToProps,
  dispatch => bindActionCreators({...actions, fetchMainSearch}, dispatch)
)(CountByTime)
