/* @flow */
import type {Thunk} from "../state/types"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import Search from "../state/Search"
import Tab from "../state/Tab"

export default (clusterId: string, spaceId: string, name: string): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const zClient = Tab.getZealot(state)
  const tabs = Tabs.getData(state)

  zClient.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(clusterId, spaceId, name))
    tabs.forEach((t) => {
      if (t.search.spaceId === spaceId) dispatch(Search.setSpace(spaceId, t.id))
    })
  })
}
