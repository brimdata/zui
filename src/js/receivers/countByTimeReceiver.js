import {receiveCountByTime, reset} from "../actions/countByTime"
import throttle from "lodash/throttle"

export default dispatch => {
  dispatch(reset())
  let descriptor
  let tuples = []

  const throttledDispatch = throttle(
    () => {
      if (tuples.length === 0) return
      dispatch(receiveCountByTime({descriptor, tuples}))
      tuples = []
    },
    50,
    {leading: false}
  )

  return ({type, results}) => {
    if (type === "SearchResult") {
      descriptor = results.descriptor
      tuples = [...tuples, ...results.tuples]
      throttledDispatch()
    }
  }
}
