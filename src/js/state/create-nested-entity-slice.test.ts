import {createReducer, createStore, EntityState} from "@reduxjs/toolkit"
import {createNestedEntitySlice} from "./create-entity-slice"

type StuffType = {
  tags: string[]
  name: string
}

const Stuff = createNestedEntitySlice<StuffType, {bagId: string}, [id: string]>(
  {
    name: "stuff",
    select: (state: EntityState<StuffType>, {bagId}) => state[bagId],
    id: (stuff) => stuff.name,
    sort: (a, b) => (a.name > b.name ? 1 : -1),
    meta: (bagId: string) => ({bagId}),
  }
)

const reducer = createReducer(
  {} as {[id: string]: EntityState<StuffType>},
  (builder) => {
    builder.addMatcher(
      (a) => a.type.startsWith(Stuff.name),
      (state, action) => {
        const key = action.meta.bagId
        state[key] = Stuff.reducer(state[key], action)
      }
    )
  }
)

const store = createStore(reducer)

test("nested entity slice", () => {
  // Create one
  store.dispatch(Stuff.at("1").create({name: "mypcap", tags: ["packets"]}))
  // Create multiple
  store.dispatch(
    Stuff.at("1").create([
      {name: "alerts", tags: ["suricata"]},
      {name: "metrics", tags: ["bi"]},
    ])
  )

  // all
  expect(Stuff.at("1").all(store.getState())).toEqual([
    {name: "alerts", tags: ["suricata"]},
    {name: "metrics", tags: ["bi"]},
    {name: "mypcap", tags: ["packets"]},
  ])

  // Update one
  store.dispatch(
    Stuff.at("1").update({id: "mypcap", changes: {tags: ["zeek", "packets"]}})
  )

  // Update multiple
  store.dispatch(
    Stuff.at("1").update([
      {
        id: "alerts",
        changes: {tags: ["security", "suricata"]},
      },
      {
        id: "metrics",
        changes: {tags: ["bi", "tooling"]},
      },
    ])
  )

  // all
  expect(Stuff.at("1").all(store.getState())).toEqual([
    {name: "alerts", tags: ["security", "suricata"]},
    {name: "metrics", tags: ["bi", "tooling"]},
    {name: "mypcap", tags: ["zeek", "packets"]},
  ])

  // find exists
  expect(Stuff.at("1").find(store.getState(), "alerts")).toEqual({
    name: "alerts",
    tags: ["security", "suricata"],
  })

  // find does not exist
  expect(Stuff.at("1").find(store.getState(), "nothing")).toEqual(undefined)

  // count
  expect(Stuff.at("1").count(store.getState())).toEqual(3)

  // ids
  expect(Stuff.at("1").ids(store.getState())).toEqual([
    "alerts",
    "metrics",
    "mypcap",
  ])

  // entities
  expect(Stuff.at("1").entities(store.getState())).toEqual({
    alerts: {name: "alerts", tags: ["security", "suricata"]},
    metrics: {name: "metrics", tags: ["bi", "tooling"]},
    mypcap: {name: "mypcap", tags: ["zeek", "packets"]},
  })

  // delete one
  store.dispatch(Stuff.at("1").delete("alerts"))

  // count
  expect(Stuff.at("1").count(store.getState())).toEqual(2)

  // delete multiple but one doesn't exist
  store.dispatch(Stuff.at("1").delete(["metrics", "pcaps"]))

  // count
  expect(Stuff.at("1").count(store.getState())).toEqual(1)

  // delete all
  store.dispatch(Stuff.at("1").deleteAll())

  expect(Stuff.at("1").count(store.getState())).toEqual(0)
})
