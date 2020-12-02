import initTestStore from "../../test/initTestStore"
import Queries from "./"
import {Group} from "./types"
import get from "lodash/get"
import {State} from "../types"

let store
beforeEach(() => {
  store = initTestStore()
})

const testLib = {
  id: "root",
  name: "root",
  items: [
    {
      // .items[0]
      id: "testId1",
      name: "testName1",
      items: [
        {
          // .items[0].items[0]
          id: "testId2",
          name: "testName2",
          description: "testDescription2",
          zql: "testValue2",
          tags: ["testTag1", "testTag2"]
        },
        {
          // .items[0].items[1]
          id: "testId3",
          name: "testName3",
          items: [
            {
              // .items[0].items[1].items[0]
              id: "testId4",
              name: "testName4",
              description: "testDescription4",
              zql: "testValue4",
              tags: ["testTag2"]
            }
          ]
        },
        {
          // .items[0].items[2]
          id: "testId5",
          name: "testName5",
          description: "testDescription5",
          zql: "testValue5",
          tags: ["testTag1"]
        }
      ]
    }
  ]
}

const newQuery = {
  id: "newQueryId",
  name: "newQueryName",
  description: "newQueryDescription",
  zql: "newQueryValue",
  tags: []
}

const newGroup = {
  id: "newGroupId",
  name: "newGroupName",
  items: []
}

const getGroup = (state: State, path: number[]): Group => {
  return get(
    Queries.getRaw(state),
    path.map((pathNdx) => `items[${pathNdx}]`).join(".")
  )
}

test("set all", () => {
  store.dispatch(Queries.setAll(testLib))

  const state = store.getState()

  expect(Queries.getRaw(state)).toEqual(testLib)
})

test("add query", () => {
  store.dispatch(Queries.setAll(testLib))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(3)

  store.dispatch(Queries.addItem(newQuery, [0]))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(4)
  expect(getGroup(store.getState(), [0]).items[3]).toEqual(newQuery)
})

test("add query, nested", () => {
  store.dispatch(Queries.setAll(testLib))

  expect(getGroup(store.getState(), [0, 1]).items).toHaveLength(1)

  store.dispatch(Queries.addItem(newQuery, [0, 1]))

  expect(getGroup(store.getState(), [0, 1]).items).toHaveLength(2)
  expect(getGroup(store.getState(), [0, 1]).items[1]).toEqual(newQuery)
})

test("add group, add query to new group", () => {
  store.dispatch(Queries.setAll(testLib))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(3)

  store.dispatch(Queries.addItem(newGroup, [0]))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(4)
  expect(getGroup(store.getState(), [0]).items[3]).toEqual(newGroup)
  expect(getGroup(store.getState(), [0, 3]).items).toHaveLength(0)

  store.dispatch(Queries.addItem(newQuery, [0, 3]))

  expect(getGroup(store.getState(), [0, 3]).items).toHaveLength(1)
  expect(getGroup(store.getState(), [0, 3]).items[0]).toEqual(newQuery)
})

test("remove query, group", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup(store.getState(), [0]).items
  expect(testName1Group).toHaveLength(3)

  store.dispatch(Queries.removeItem([0, 0]))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(2)
  expect(getGroup(store.getState(), [0]).items).toEqual(testName1Group.slice(1))

  store.dispatch(Queries.removeItem([0, 0]))
  expect(getGroup(store.getState(), [0]).items).toHaveLength(1)
  expect(getGroup(store.getState(), [0]).items).toEqual([testName1Group[2]])
})

test("move query, same group, different group same depth", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup(store.getState(), [0]).items
  expect(testName1Group).toHaveLength(3)

  const testName2Query = testName1Group[0]

  // move to end
  store.dispatch(Queries.moveItem([0, 0], [0, 2]))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(3)

  expect(getGroup(store.getState(), [0]).items).toEqual([
    ...testName1Group.slice(1),
    testName2Query
  ])

  // move back to beginning
  store.dispatch(Queries.moveItem([0, 2], [0, 0]))

  expect(getGroup(store.getState(), [0]).items).toHaveLength(3)
  expect(getGroup(store.getState(), [0]).items).toEqual(testName1Group)

  // move to "uncle's" group
  store.dispatch(Queries.addItem(newGroup, [0]))

  expect(getGroup(store.getState(), [0, 1]).items).toHaveLength(1)
  expect(getGroup(store.getState(), [0, 3]).items).toHaveLength(0)

  const testName4Query = getGroup(store.getState(), [0, 1]).items[0]

  store.dispatch(Queries.moveItem([0, 1, 0], [0, 3, 0]))

  expect(getGroup(store.getState(), [0, 1]).items).toHaveLength(0)
  expect(getGroup(store.getState(), [0, 3]).items).toHaveLength(1)
  expect(getGroup(store.getState(), [0, 3]).items[0]).toEqual(testName4Query)
})

test("move query, different group", () => {
  store.dispatch(Queries.setAll(testLib))

  const testName1Group = getGroup(store.getState(), [0]).items
  const testName3Group = (testName1Group[1] as Group).items

  expect(testName1Group).toHaveLength(3)
  expect(testName3Group).toHaveLength(1)

  const testName2Query = testName1Group[0]

  store.dispatch(Queries.moveItem([0, 0], [0, 1, 0]))

  const newTestName1Group = getGroup(store.getState(), [0]).items
  const newTestName3Group = (newTestName1Group[0] as Group).items

  expect(newTestName1Group).toHaveLength(2)
  expect(newTestName3Group).toHaveLength(2)

  expect(newTestName1Group[0].id).toEqual(testName1Group[1].id)
  expect(newTestName3Group).toEqual([testName2Query, ...testName3Group])
})

test("edit query", () => {
  store.dispatch(Queries.setAll(testLib))

  store.dispatch(Queries.editItem(newQuery, [0, 0]))
  expect(getGroup(store.getState(), [0]).items[0]).toEqual(newQuery)
})

test("edit group", () => {
  store.dispatch(Queries.setAll(testLib))

  store.dispatch(Queries.editItem(newGroup, [0, 1]))
  expect(getGroup(store.getState(), [0, 1])).toEqual(newGroup)
})
