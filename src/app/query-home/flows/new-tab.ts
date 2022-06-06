import {lakeImportPath, lakesPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export const newTab = (): Thunk => (dispatch, getState) => {
  const lakeId = Current.getLakeId(getState())
  let url: string
  if (!lakeId) {
    url = lakesPath()
  } else {
    url = lakeImportPath(lakeId)
  }
  dispatch(Tabs.create(url))
}
