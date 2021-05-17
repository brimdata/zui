import initTestStore from "src/js/test/initTestStore"
import ConfigPropValues from "./index"

const configName1 = "testconfig1"
const configName2 = "testconfig2"
const configProperty1 = "testproperty1"
const configProperty2 = "testproperty2"

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
  // add one prop to one config
  dispatch(
    ConfigPropValues.set({
      configName: configName1,
      propName: configProperty1,
      value: data1
    })
  )

  let all = select(ConfigPropValues.all)
  expect(Object.keys(all)).toHaveLength(1)
  expect(Object.keys(all[configName1])).toHaveLength(1)

  expect(select(ConfigPropValues.get(configName1, configProperty1))).toEqual(
    data1
  )

  // add second prop to first config
  dispatch(
    ConfigPropValues.set({
      configName: configName1,
      propName: configProperty2,
      value: data2
    })
  )

  all = select(ConfigPropValues.all)
  expect(Object.keys(all)).toHaveLength(1)
  expect(Object.keys(all[configName1])).toHaveLength(2)

  expect(select(ConfigPropValues.get(configName1, configProperty2))).toEqual(
    data2
  )

  // add second config, first prop
  dispatch(
    ConfigPropValues.set({
      configName: configName2,
      propName: configProperty1,
      value: data2
    })
  )

  all = select(ConfigPropValues.all)
  expect(Object.keys(all)).toHaveLength(2)
  expect(Object.keys(all[configName2])).toHaveLength(1)

  expect(select(ConfigPropValues.get(configName2, configProperty1))).toEqual(
    data2
  )

  // update first
  dispatch(
    ConfigPropValues.set({
      configName: configName1,
      propName: configProperty1,
      value: data2
    })
  )
  all = select(ConfigPropValues.all)
  expect(Object.keys(all)).toHaveLength(2)
  expect(Object.keys(all[configName1])).toHaveLength(2)

  expect(select(ConfigPropValues.get(configName1, configProperty1))).toEqual(
    data2
  )
})

test("Delete", () => {
  dispatch(
    ConfigPropValues.set({
      configName: configName1,
      propName: configProperty1,
      value: data1
    })
  )

  dispatch(
    ConfigPropValues.delete({
      configName: configName1,
      propName: configProperty1
    })
  )

  const all = select(ConfigPropValues.all)
  expect(Object.keys(all)).toHaveLength(0)
  expect(select(ConfigPropValues.get(configName1, configProperty1))).toBeNull()
})
