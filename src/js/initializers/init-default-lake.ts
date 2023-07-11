import Current from "../state/Current"
import {Store} from "../state/types"

export function initDefaultLake(store: Store) {
  const lakeId = Current.getLakeId(store.getState())
  // The lakeTabs need to know the current lake id
  store.dispatch(Current.setLakeId(lakeId))
}
