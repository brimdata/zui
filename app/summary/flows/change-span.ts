import {lakeSummaryPath} from "app/router/utils/paths"
import Current from "src/js/state/Current"

const changeSpan = () => (dispatch, getState) => {
  const lakeId = Current.getSpaceId(getState())
  const workspaceId = Current.getWorkspaceId(getState())
  const {spanArgs} = Current.getSearchParams(getState())
  const history = Current.getHistory(getState())
  history.push(lakeSummaryPath(lakeId, workspaceId, {spanArgs}))
}

export default changeSpan
