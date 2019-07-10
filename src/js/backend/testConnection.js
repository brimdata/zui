/* @flow */
import type {Cluster} from "../state/clusters/types"
import type {Thunk} from "../state/types"
import {fetchSpaces} from "./fetch"
import {setBoomCluster} from "./options"

export function testConnection(cluster: Cluster): Thunk {
  return function(dispatch) {
    dispatch(setBoomCluster(cluster))
    return new Promise((resolve, reject) => {
      dispatch(fetchSpaces())
        .done((spaces) => resolve(spaces))
        .error((e) => reject(e))
    })
  }
}
