import {lakeSummaryPath} from "app/router/utils/paths"
import Current from "src/js/state/Current"
import Url from "src/js/state/Url"
const changeSpan = () => (dispatch, getState) => {
  const lakeId = Current.getSpaceId(getState())
  const workspaceId = Current.getWorkspaceId(getState())
  const {spanArgs} = Url.getSearchParams(getState())
  const history = Current.getHistory(getState())
  history.push(lakeSummaryPath(lakeId, workspaceId, {spanArgs}))
}

export default changeSpan
