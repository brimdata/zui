/* @flow */

import type {Cluster} from "./types"
import type {Thunk} from "../types"
import {initSpace} from "../../flows/initSpace"
import Current from "../Current"
import Errors from "../Errors"
import Handlers from "../Handlers"
import History from "../History"
import Search from "../Search"
import SearchBar from "../SearchBar"
import Tabs from "../Tabs"
import Viewer from "../Viewer"

export function connectCluster(cluster: Cluster): Thunk {
  return function(d, getState, {createZealot}) {
    const zealot = createZealot(Current.getConnectionId(getState()))
    return zealot.status().then(() => {
      d(Current.setConnectionId(cluster.id))
      d(initSpace("default"))
    })
  }
}

export function disconnectCluster(): Thunk {
  return function(dispatch, getState) {
    let tabId = Tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(Current.setConnectionId(""))
  }
}

export function switchCluster(cluster: Cluster): Thunk {
  return function(dispatch, getState) {
    let tabId = Tabs.getActive(getState())
    clearClusterState(dispatch, tabId)
    dispatch(Current.setConnectionId(cluster.id))
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
