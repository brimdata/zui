import Clusters from "./"
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
  let state = store.dispatchAll([Clusters.add(cluster)])

  expect(Clusters.id("123")(state)).toEqual(cluster)
})

test("addCluster when it already exists", () => {
  let state = store.dispatchAll([Clusters.add(cluster), Clusters.add(cluster)])

  expect(Clusters.all(state)).toEqual([cluster])
})

test("removeCluster", () => {
  let state = store.dispatchAll([Clusters.add(cluster), Clusters.remove("123")])

  expect(Clusters.all(state)).toEqual([])
})
