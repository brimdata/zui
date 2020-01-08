/* @flow */

import clusters from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let cluster = {
  id: "123",
  host: "boom.com",
  port: "9867",
  username: "kerr",
  password: "123"
}

test("addCluster", () => {
  let state = store.dispatchAll([clusters.add(cluster)])

  expect(clusters.id("123")(state)).toEqual(cluster)
})

test("addCluster when it already exists", () => {
  let state = store.dispatchAll([clusters.add(cluster), clusters.add(cluster)])

  expect(clusters.all(state)).toEqual([cluster])
})

test("removeCluster", () => {
  let state = store.dispatchAll([clusters.add(cluster), clusters.remove("123")])

  expect(clusters.all(state)).toEqual([])
})
