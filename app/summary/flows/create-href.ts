import {lakeSummaryPath} from "app/router/utils/paths"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"

const createHref = () => (_, getState) => {
  const lakeId = Current.getSpaceId(getState())
  const workspaceId = Current.getWorkspaceId(getState())
  const spanArgs = Tab.getSpanArgs(getState())
  return lakeSummaryPath(lakeId, workspaceId, {spanArgs})
}

export default createHref
