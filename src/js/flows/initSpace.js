/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import Modal from "../state/Modal"
import Notice from "../state/Notice"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import submitSearch from "./submitSearch"
import {globalDispatch} from "../state/GlobalContext"
import find from "lodash/find"

export const initSpace = (desiredID: string): Thunk => (
  dispatch,
  getState,
  {zealot}
) => {
  let tabId = Tabs.getActive(getState())
  let clusterId = Tab.clusterId(getState())
  return zealot.spaces
    .list()
    .then((val) => (val === null ? [] : val))
    .then(checkSpacesExist)
    .then((spaces) => getCurrentSpaceId(spaces, desiredID))
    .then((spaceId) => zealot.spaces.get(spaceId))
    .then((data) => setSpace(dispatch, data, clusterId))
    .then((data) => setSearchDefaults(dispatch, data))
    .then((data) => checkDataExists(dispatch, data, tabId))
    .then(() => {
      dispatch(submitSearch({history: false, investigation: false}))
    })
    .catch((error) => {
      console.error(error)
      dispatch(Notice.set(ErrorFactory.create(error)))
    })
}

function checkDataExists(dispatch, data, tabId) {
  if (brim.space(data).empty()) {
    dispatch(Viewer.clear(tabId))
  }
}

function checkSpacesExist(spaces) {
  if (spaces.length === 0) throw new NoSpacesError()
  else return spaces
}

function getCurrentSpaceId(spaces, desiredID) {
  const currentSpace = find(spaces, {id: desiredID}) || spaces[0]
  return currentSpace.id
}

function setSpace(dispatch, data, clusterId) {
  globalDispatch(Spaces.setDetail(clusterId, data))
  dispatch(Search.setSpace(data.id))
  data = brim.interop.spacePayloadToSpace(data)
  return data
}

function setSearchDefaults(dispatch, data) {
  dispatch(Search.setSpanArgs(brim.space(data).everythingSpan()))
  dispatch(SearchBar.removeAllSearchBarPins())
  dispatch(SearchBar.changeSearchBarInput(""))
  return data
}
