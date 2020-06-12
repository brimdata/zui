/* @flow */

import {viewLogDetail} from "../flows/viewLogDetail"
import LogDetails from "../state/LogDetails"
import Search from "../state/Search/actions"
import Tab from "../state/Tab"
import brim from "../brim"
import initialize from "./initialize"

export default async () => {
  const store = await initialize()
  // Set the span to everything
  const space = Tab.space(store.getState())
  space && store.dispatch(Search.setSpan(brim.space(space).everythingSpan()))

  // View the latest log and clear log detail history
  const log = LogDetails.build(store.getState())
  console.log(log)
  store.dispatch(LogDetails.clear())
  log && store.dispatch(viewLogDetail(log))

  return store
}
