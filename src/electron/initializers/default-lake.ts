import {ZuiMain} from "../zui-main"
import Lakes from "src/js/state/Lakes"
import Current from "src/js/state/Current"

/**
 * Sets up the default lake if it doesn't exist
 */
export function initialize(main: ZuiMain) {
  const port = main.args.lakePort
  const user = main.appMeta.userName
  const lake = Lakes.getDefaultLake(port, user)

  const exists = Lakes.id(lake.id)(main.store.getState())
  if (exists) return

  main.store.dispatch(Lakes.add(lake))
  main.store.dispatch(Current.setLakeId(lake.id))
}
