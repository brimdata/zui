/* @flow */

import {addCluster, removeCluster} from "./actions"
import {getCurrentCluster, getSavedClusters} from "./selectors"
import initTestStore from "../../test/initTestStore"
import search from "../search"

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
  let state = store.dispatchAll([search.setCluster(cluster)])

  expect(getCurrentCluster(state)).toEqual(cluster)
})
