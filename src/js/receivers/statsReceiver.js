import {setSearchStats} from "../actions/searchStats"

export default dispatch => payload => {
  if (payload.type === "SearchStats") {
    dispatch(
      setSearchStats({
        startTime: payload.start_time,
        updateTime: payload.update_time,
        bytesMatched: payload.stats.bytes_matched,
        bytesRead: payload.stats.bytes_read,
        tuplesMatched: payload.stats.tuples_matched,
        tuplesRead: payload.stats.tuples_read
      })
    )
  }
}
