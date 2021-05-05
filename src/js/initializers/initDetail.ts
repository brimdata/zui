import {viewLogDetail} from "../flows/viewLogDetail"
import Current from "../state/Current"
import LogDetails from "../state/LogDetails"
import Search from "../state/Search/actions"
import brim from "../brim"
import initialize from "./initialize"

export default async () => {
  const {store, pluginManager} = await initialize()
  // Set the span to everything
  const pool = Current.mustGetPool(store.getState())
  pool && store.dispatch(Search.setSpan(brim.pool(pool).everythingSpan()))

  // View the latest log and clear log detail history
  const log = LogDetails.build(store.getState())
  store.dispatch(LogDetails.clear())
  log && store.dispatch(viewLogDetail(log))

  return {store, pluginManager}
}
