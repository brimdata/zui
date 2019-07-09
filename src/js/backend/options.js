/* @flow */

import type {Cluster} from "../state/clusters/types"
import type {Thunk} from "../state/types"
import {getBoomOptions} from "../state/selectors/boom"

export const updateBoomOptions = (): Thunk => (dispatch, getState, boom) => {
  boom.setOptions(getBoomOptions(getState()))
}

export const setBoomCluster = (cluster: Cluster): Thunk => (_d, _gs, boom) => {
  boom.setOptions({
    host: cluster.host,
    port: parseInt(cluster.port),
    username: cluster.username,
    password: cluster.password
  })
}
