/* @flow */

import type {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import Tab from "../state/Tab"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default async function(store: Store) {
  let {space, host, port, id} = getUrlSearchParams()
  let cluster = {
    id: "zqd",
    host: host || "localhost",
    port: port || "9867",
    username: "",
    password: ""
  }
  global.windowId = id
  store.dispatch(Clusters.add(cluster))
  store.dispatch(Current.setConnectionId(cluster.id))
  await store.dispatch(refreshSpaceNames())

  const lastId = Tab.getSpaceId(store.getState())
  const spaceId = space || lastId

  if (spaceId) store.dispatch(initSpace(spaceId))
}
