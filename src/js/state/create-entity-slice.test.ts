import {createStore, EntityState} from "@reduxjs/toolkit"
import {createEntitySlice} from "./create-entity-slice"

type StuffType = {
  tags: string[]
  name: string
}

const Stuff = createEntitySlice<StuffType>({
  name: "stuff",
  select: (state: EntityState<StuffType>) => state,
  id: (stuff) => stuff.name,
  sort: (a, b) => (a.name > b.name ? 1 : -1),
})

const store = createStore(Stuff.reducer)

test("entity slice", () => {
  // Create one
  store.dispatch(Stuff.create({name: "mypcap", tags: ["packets"]}))
  // Create multiple
  store.dispatch(
    Stuff.create([
      {name: "alerts", tags: ["suricata"]},
      {name: "metrics", tags: ["bi"]},
    ])
  )

  // all
  expect(Stuff.all(store.getState())).toEqual([
    {name: "alerts", tags: ["suricata"]},
    {name: "metrics", tags: ["bi"]},
    {name: "mypcap", tags: ["packets"]},
  ])

  // Update one
  store.dispatch(
    Stuff.update({id: "mypcap", changes: {tags: ["zeek", "packets"]}})
  )

  // Update multiple
  store.dispatch(
    Stuff.update([
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
  expect(Stuff.all(store.getState())).toEqual([
    {name: "alerts", tags: ["security", "suricata"]},
    {name: "metrics", tags: ["bi", "tooling"]},
    {name: "mypcap", tags: ["zeek", "packets"]},
  ])

  // find exists
  expect(Stuff.find(store.getState(), "alerts")).toEqual({
    name: "alerts",
    tags: ["security", "suricata"],
  })

  // find does not exist
  expect(Stuff.find(store.getState(), "nothing")).toEqual(undefined)

  // count
  expect(Stuff.count(store.getState())).toEqual(3)

  // ids
  expect(Stuff.ids(store.getState())).toEqual(["alerts", "metrics", "mypcap"])

  // entities
  expect(Stuff.entities(store.getState())).toEqual({
    alerts: {name: "alerts", tags: ["security", "suricata"]},
    metrics: {name: "metrics", tags: ["bi", "tooling"]},
    mypcap: {name: "mypcap", tags: ["zeek", "packets"]},
  })

  // delete one
  store.dispatch(Stuff.delete("alerts"))

  // count
  expect(Stuff.count(store.getState())).toEqual(2)

  // delete multiple but one doesn't exist
  store.dispatch(Stuff.delete(["metrics", "pcaps"]))

  // count
  expect(Stuff.count(store.getState())).toEqual(1)

  // delete all
  store.dispatch(Stuff.deleteAll())

  expect(Stuff.count(store.getState())).toEqual(0)
})

test("nested entity slice", () => {})
