import Clusters from "../state/Clusters"
import {Store} from "../state/types"

export const initConnectionStatuses = (store: Store) => {
  const clusters = Clusters.all(store.getState())
  clusters.forEach(({id}) => {
    store.dispatch(Clusters.setStatus(id, "initial"))
  })
}
