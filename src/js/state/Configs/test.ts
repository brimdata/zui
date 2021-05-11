import initTestStore from "src/js/test/initTestStore"
import Configs, {Config, ConfigItem} from "./index"

const testProperty1: ConfigItem = {
  name: "testProperty1",
  type: "string",
  label: "Test Property 1",
  defaultValue: "test initial value"
}

const testProperty2: ConfigItem = {
  name: "testProperty2",
  type: "string",
  label: "Test Property 2",
  defaultValue: "test initial value 2"
}

const testConfig1: Config = {
  name: "testConfig1",
  title: "Test Config 1",
  properties: {
    testProperty1
  }
}
const testConfig2: Config = {
  name: "testConfig2",
  title: "Test Config 2",
  properties: {
    testProperty2
  }
}

let select, dispatch, store
beforeEach(() => {
  store = initTestStore()
  dispatch = store.dispatch
  select = (f) => f(store.getState())
})

test("Create", () => {
  // add one
  dispatch(Configs.create(testConfig1))
  expect(select(Configs.all)).toHaveLength(1)
  expect(select(Configs.get(testConfig1.name))).toEqual(testConfig1)

  // add second
  dispatch(Configs.create(testConfig2))
  expect(select(Configs.all)).toHaveLength(2)
  expect(select(Configs.get(testConfig2.name))).toEqual(testConfig2)
})

test("Update default value", () => {
  dispatch(Configs.create(testConfig1))

  const newValue = "updated value"
  dispatch(
    Configs.updatePropertyDefault({
      configName: testConfig1.name,
      propertyName: testProperty1.name,
      defaultValue: newValue
    })
  )
  expect(select(Configs.all)).toHaveLength(1)
  expect(select(Configs.get(testConfig1.name))).toEqual({
    ...testConfig1,
    properties: {
      ...testConfig1.properties,
      testProperty1: {
        ...testConfig1.properties.testProperty1,
        defaultValue: newValue
      }
    }
  })
})

test("Delete", () => {
  dispatch(Configs.create(testConfig1))

  dispatch(Configs.delete(testConfig1.name))
  expect(select(Configs.all)).toHaveLength(0)
  expect(select(Configs.get(testConfig1.name))).not.toBeDefined()
})
