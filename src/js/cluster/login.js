/* @flow */
import type {Cluster} from "../state/clusters/types"
import type {Thunk} from "../state/types"
import {setBoomCluster} from "../backend/options"
import {setClusterError, setClusterState} from "../state/clusters/actions"
import {testConnection} from "../backend/testConnection"

export function login(cluster: Cluster): Thunk {
  return function(dispatch) {
    dispatch(setBoomCluster(cluster))
    dispatch(setClusterState("testing"))
    return dispatch(testConnection())
      .then(() => {
        dispatch(setClusterState("ok"))
      })
      .catch((e) => {
        dispatch(setClusterState("error"))
        dispatch(setClusterError(e))
      })
  }
}
