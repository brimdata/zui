import {zed} from "zealot-old"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import Columns from "./"
import actions from "./actions"
import {createColumn} from "./models/column"
import touch from "./touch"

const columns = {
  "1": new zed.Schema(
    "1",
    new zed.TypeRecord([
      {name: "_path", type: zed.TypeString},
      {name: "duration", type: zed.TypeDuration}
    ])
  ),
  "2": new zed.Schema(
    "2",
    new zed.TypeRecord([
      {name: "_path", type: zed.TypeString},
      {name: "ts", type: zed.TypeTime}
    ])
  )
}

let store
beforeEach(() => {
  store = initTestStore()
})

test("visibility false when at least one is hidden", () => {
  const prefName = "temp"
  const col = createColumn("_path")
  const update = {[col.key]: {isVisible: false}}

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toMatchInlineSnapshot(`
    Object {
      "_path": Object {
        "isVisible": false,
      },
      "duration": Object {
        "isVisible": false,
      },
      "ts": Object {
        "isVisible": false,
      },
    }
  `)
})

test("visibility true when no preferences exist", () => {
  const prefName = "temp"

  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toMatchInlineSnapshot(`
    Object {
      "_path": Object {
        "isVisible": true,
      },
      "duration": Object {
        "isVisible": true,
      },
      "ts": Object {
        "isVisible": true,
      },
    }
  `)
})

test("visibility true when all are visible", () => {
  const prefName = "temp"

  const col = createColumn("_path")
  const col2 = createColumn("duration")
  const update = {
    [col.key]: {isVisible: true},
    [col2.key]: {isVisible: true}
  }

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toMatchInlineSnapshot(`
    Object {
      "_path": Object {
        "isVisible": true,
      },
      "duration": Object {
        "isVisible": true,
      },
      "ts": Object {
        "isVisible": true,
      },
    }
  `)
})
