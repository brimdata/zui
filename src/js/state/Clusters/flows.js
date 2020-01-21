/* @flow */

import type {Cluster} from "./types"
import type {Thunk} from "../types"
import {initSpace} from "../../flows/initSpace"
import {testConnection} from "../../services/boom"
import Errors from "../Errors"
import Handlers from "../Handlers"
import History from "../History"
import Search from "../Search"
import SearchBar from "../SearchBar"
import Spaces from "../Spaces"
import Tabs from "../Tabs"
import Viewer from "../viewer"

export function connectCluster(cluster: Cluster): Thunk {
  return function(d) {
    return d(testConnection(cluster)).then((spaces) => {
      d(Spaces.setNames(cluster.id, spaces))
      d(Search.setCluster(cluster.id))
      d(initSpace("default"))
    })
  }
}

export function disconnectCluster(): Thunk {
  return function(dispatch, getState) {
    let tabId = Tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(Search.setCluster(""))
  }
}

export function switchCluster(cluster: Cluster): Thunk {
  return function(dispatch, getState) {
    let tabId = Tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(Search.setCluster(cluster.id))
    return dispatch(connectCluster(cluster))
  }
}

function clearClusterState(dispatch, tabId: string) {
  dispatch(SearchBar.clearSearchBar())
  dispatch(History.clear())
  dispatch(Viewer.clear(tabId))
  dispatch(Handlers.abortAll())
  dispatch(Errors.clearErrors())
  dispatch(Search.clear())
}
