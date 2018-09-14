import * as Time from "../lib/Time"
import {setSearchStats} from "../actions/searchStats"

export default dispatch => payload => {
  if (payload.type === "SearchStats") {
    dispatch(
      setSearchStats({
        startTime: Time.parseFromBoom(payload.start_time),
        updateTime: Time.parseFromBoom(payload.update_time),
        bytesMatched: payload.stats.bytes_matched,
        bytesRead: payload.stats.bytes_read,
        tuplesMatched: payload.stats.tuples_matched,
        tuplesRead: payload.stats.tuples_read
      })
    )
  }
}
