import Current from "src/js/state/Current"
import createHref from "./create-href"

const changeSpan = () => (dispatch, getState) => {
  const history = Current.getHistory(getState())
  history.push(dispatch(createHref()))
}

export default changeSpan
