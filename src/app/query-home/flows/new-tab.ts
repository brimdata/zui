import {lakesPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export const newTab = (): Thunk => (dispatch, getState) => {
  const lakeId = Current.getLakeId(getState())
  if (!lakeId) {
    dispatch(Tabs.create(lakesPath()))
  } else {
    dispatch(Tabs.createQuerySession())
  }
}
