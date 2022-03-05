import {featureIsEnabled} from "src/app/core/feature-flag"
import {
  lakeImportPath,
  lakeQueryPath,
  lakesPath
} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {newQuery} from "./new-query"

export const newTab = (): Thunk => (dispatch, getState) => {
  if (!featureIsEnabled("query-flow")) {
    return legacyNewTab(dispatch, getState)
  }

  const lakeId = Current.getLakeId(getState())
  const poolIds = Pools.ids(lakeId)(getState())
  let url: string
  if (!lakeId) {
    url = lakesPath()
  } else if (poolIds.length === 0) {
    url = lakeImportPath(lakeId)
  } else {
    url = lakeQueryPath(dispatch(newQuery()).id, lakeId, {isDraft: true})
  }
  dispatch(Tabs.new(url))
}

function legacyNewTab(dispatch, getState) {
  const lakeId = Current.getLakeId(getState())
  const path = lakeId ? lakeImportPath(lakeId) : lakesPath()
  dispatch(Tabs.new(path))
}
