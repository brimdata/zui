/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import {
  changeSearchBarInput,
  removeAllSearchBarPins,
  setCurrentSpaceName
} from "../state/actions"
import {clearViewer} from "../state/viewer/actions"
import {fetchSpace, fetchSpaces} from "../services/boom"
import Spaces from "../state/spaces"
import Tab from "../state/tab"
import brim from "../brim"
import modal from "../state/modal"
import notice from "../state/notice"
import search from "../state/search"
import submitSearch from "./submitSearch"
import tabs from "../state/tabs"

export const initSpace = (desired: string): Thunk => (dispatch, getState) => {
  let tabId = tabs.getActive(getState())
  let clusterId = Tab.clusterId(getState())

  return dispatch(fetchSpaces())
    .then(checkSpacesExist)
    .then((spaces) => getCurrentSpaceName(spaces, desired))
    .then((name) => dispatch(fetchSpace(name)))
    .then((data) => setSpace(dispatch, data, clusterId))
    .then((data) => setSearchDefaults(dispatch, data))
    .then((data) => checkDataExists(dispatch, data, tabId))
    .then(() => dispatch(submitSearch()))
    .catch((error) => dispatch(notice.set(error)))
}

function checkDataExists(dispatch, data, tabId) {
  if (brim.space(data).empty()) {
    dispatch(clearViewer(tabId))
    dispatch(modal.show("nodata"))
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
  dispatch(removeAllSearchBarPins())
  dispatch(changeSearchBarInput(""))
  return data
}
