import Current from "../state/Current"
import {Store} from "../state/types"
import {defaultLake} from "./initLakeParams"
import Window from "../state/Window"

export function initLake(store: Store) {
  const lakeId = Current.getLakeId(store.getState())
  const id = lakeId || defaultLake().id
  // This sets up the lake's tabs
  store.dispatch(Window.setLakeId(id))
}
