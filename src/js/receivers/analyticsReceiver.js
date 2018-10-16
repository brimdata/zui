import {setAnalysis} from "../actions/analysis"
import throttle from "lodash/throttle"

export default (dispatch, id) => {
  let tuples = []
  let descriptor = []

  const dispatchResults = throttle(() => {
    if (tuples.length === 0) return
    dispatch(setAnalysis({id, tuples, descriptor}))
    tuples = []
  }, 200)

  return ({type, channel_id, results}) => {
    if (type === "SearchResult" && channel_id === id) {
      tuples = [...tuples, ...results.tuples]

      descriptor = results.descriptor
      dispatchResults()
    }
  }
}
