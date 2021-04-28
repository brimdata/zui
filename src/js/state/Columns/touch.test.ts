import {INTERVAL, STRING} from "test/fixtures/zjson-types"
import {zed} from "zealot"
import initTestStore from "../../test/initTestStore"
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
  const col = createColumn({name: "_path", type: STRING})
  const update = {[col.key]: {isVisible: false}}

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: false},
    "duration:interval": {isVisible: false},
    "ts:time": {isVisible: false}
  })
})

test("visibility true when no preferences exist", () => {
  const prefName = "temp"

  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: true},
    "duration:interval": {isVisible: true},
    "ts:time": {isVisible: true}
  })
})

test("visibility true when all are visible", () => {
  const prefName = "temp"
  const col = createColumn({name: "_path", type: STRING})
  const col2 = createColumn({name: "duration", type: INTERVAL})
  const update = {
    [col.key]: {isVisible: true},
    [col2.key]: {isVisible: true}
  }

  store.dispatch(actions.updateColumns(prefName, update))
  store.dispatch(touch(columns))
  const prefs = Columns.getColumns(store.getState())[prefName]

  expect(prefs).toEqual({
    "_path:string": {isVisible: true},
    "duration:interval": {isVisible: true},
    "ts:time": {isVisible: true}
  })
})
