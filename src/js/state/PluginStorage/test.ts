import initTestStore from "test/unit/helpers/initTestStore"
import PluginStorage from "./index"

const pluginName1 = "testplugin1"
const pluginName2 = "testplugin2"

const data1 = {
  test: "test"
}

const data2 = "test2"

let select, dispatch, store
beforeEach(() => {
  store = initTestStore()
  dispatch = store.dispatch
  select = (f) => f(store.getState())
})

test("Create or Update (Upsert)", () => {
  // add one
  dispatch(PluginStorage.set({name: pluginName1, data: data1}))
  expect(select(PluginStorage.all)).toHaveLength(1)
  expect(select(PluginStorage.getData(pluginName1))).toEqual(data1)

  // add second
  dispatch(PluginStorage.set({name: pluginName2, data: data2}))
  expect(select(PluginStorage.all)).toHaveLength(2)
  expect(select(PluginStorage.getData(pluginName2))).toEqual(data2)

  // update first
  dispatch(PluginStorage.set({name: pluginName1, data: data2}))
  expect(select(PluginStorage.all)).toHaveLength(2)
  expect(select(PluginStorage.getData(pluginName1))).toEqual(data2)
})

test("Delete", () => {
  dispatch(PluginStorage.set({name: pluginName1, data: data1}))

  dispatch(PluginStorage.delete(pluginName1))
  expect(select(PluginStorage.all)).toHaveLength(0)
  expect(select(PluginStorage.getData(pluginName1))).not.toBeDefined()
})
