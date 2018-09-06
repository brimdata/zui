import {receiveCountByTime} from "../actions/countByTime"

export default dispatch => ({type, results}) => {
  if (type === "SearchResult") {
    dispatch(receiveCountByTime(results))
  }
}
