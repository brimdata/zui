/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import {fetchSpace, fetchSpaces} from "../services/boom"
import {setCurrentSpaceName} from "../state/actions"
import ErrorFactory from "../models/ErrorFactory"
import Modal from "../state/Modal"
import Notice from "../state/Notice"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/viewer"
import brim from "../brim"
import search from "../state/Search"
import submitSearch from "./submitSearch"

export const initSpace = (desired: string): Thunk => (dispatch, getState) => {
  let tabId = Tabs.getActive(getState())
  let clusterId = Tab.clusterId(getState())

  return dispatch(fetchSpaces())
    .then(checkSpacesExist)
    .then((spaces) => getCurrentSpaceName(spaces, desired))
    .then((name) => dispatch(fetchSpace(name)))
    .then((data) => setSpace(dispatch, data, clusterId))
    .then((data) => setSearchDefaults(dispatch, data))
    .then((data) => checkDataExists(dispatch, data, tabId))
    .then(() => dispatch(submitSearch()))
    .catch((error) => dispatch(Notice.set(ErrorFactory.create(error))))
}

function checkDataExists(dispatch, data, tabId) {
  if (brim.space(data).empty()) {
    dispatch(Viewer.clear(tabId))
    dispatch(Modal.show("nodata"))
  }
}

function checkSpacesExist(spaces) {
  if (spaces.length === 0) throw new NoSpacesError()
  else return spaces
}

function getCurrentSpaceName(spaces, desired) {
  return spaces.includes(desired) ? desired : spaces[0]
}

function setSpace(dispatch, data, clusterId) {
  dispatch(Spaces.setDetail(clusterId, data))
  dispatch(setCurrentSpaceName(data.name))
  return data
}

function setSearchDefaults(dispatch, data) {
  dispatch(search.setSpanArgs(brim.space(data).defaultSpanArgs()))
  dispatch(SearchBar.removeAllSearchBarPins())
  dispatch(SearchBar.changeSearchBarInput(""))
  return data
}
