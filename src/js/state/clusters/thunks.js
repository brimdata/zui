/* @flow */

import type {Cluster} from "./types"
import type {Thunk} from "../types"
import {clearErrors} from "../errors"
import {
  clearNotifications,
  clearSearchBar,
  clearSearchHistory,
  clearSpaces,
  clearStarredLogs,
  setSpaceNames
} from "../actions"
import {clearSearches} from "../searches/actions"
import {clearViewer} from "../viewer/actions"
import {setCluster} from "./actions"
import {testConnection} from "../../services/boom"
import search from "../search"

export function connectCluster(cluster: Cluster): Thunk {
  return function(d) {
    return d(testConnection(cluster)).then((spaces) => {
      d(setSpaceNames(spaces))
      d(setCluster(cluster))
    })
  }
}

export function disconnectCluster(): Thunk {
  return function(dispatch) {
    clearClusterState(dispatch)
    dispatch(setCluster(null))
  }
}

export function switchCluster(cluster: Cluster): Thunk {
  return function(dispatch) {
    clearClusterState(dispatch)
    dispatch(setCluster(cluster))
    return dispatch(connectCluster(cluster))
  }
}

function clearClusterState(dispatch) {
  dispatch(clearSearchBar())
  dispatch(clearSpaces())
  dispatch(search.clear())
  dispatch(clearStarredLogs())
  dispatch(clearSearchHistory())
  dispatch(clearViewer())
  dispatch(clearSearches())
  dispatch(clearErrors())
  dispatch(clearNotifications())
}
