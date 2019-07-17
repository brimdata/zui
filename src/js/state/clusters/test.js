/* @flow */

import {NoSpacesError} from "../../models/Errors"
import {addCluster, removeCluster, setCluster, setClusterError} from "./actions"
import {
  getCurrentCluster,
  getClusterMessage,
  getSavedClusters
} from "./selectors"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let cluster = {
  host: "boom.com",
  port: "9867",
  username: "kerr",
  password: "123"
}

test("addCluster", () => {
  let state = store.dispatchAll([addCluster(cluster)])

  expect(getSavedClusters(state)).toEqual([cluster])
})

test("addCluster when it already exists", () => {
  let state = store.dispatchAll([addCluster(cluster), addCluster(cluster)])

  expect(getSavedClusters(state)).toEqual([cluster])
})

test("removeCluster", () => {
  let state = store.dispatchAll([addCluster(cluster), removeCluster(cluster)])

  expect(getSavedClusters(state)).toEqual([])
})

test("setCluster", () => {
  let state = store.dispatchAll([setCluster(cluster)])

  expect(getCurrentCluster(state)).toEqual(cluster)
})

test("setClusterMessage to message", () => {
  let state = store.dispatchAll([setClusterError(new NoSpacesError())])

  expect(getClusterMessage(state)).toEqual(new NoSpacesError())
})

test("setClusterMessage to empty", () => {
  let state = store.dispatchAll([setClusterError(null)])

  expect(getClusterMessage(state)).toEqual(null)
})
