import {setSearchStats} from "../actions/searchStats"

function boomTime({sec, ns}) {
    let flt = sec + ns / 1e9
    return flt
}

export default dispatch => payload => {
  if (payload.type === "SearchStats") {
    const startTime = boomTime(payload.start_time)
    const updateTime = boomTime(payload.update_time)
    dispatch(
      setSearchStats({
        startTime,
        updateTime,
        bytesMatched: payload.stats.bytes_matched,
        bytesRead: payload.stats.bytes_read,
        tuplesMatched: payload.stats.tuples_matched,
        tuplesRead: payload.stats.tuples_read
      })
    )
  }
}
