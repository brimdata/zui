import form, {FormConfig} from "./form"

const sampleConfig = (): FormConfig => ({
  username: {
    type: "string",
    label: "Username",
    name: "username",
    defaultValue: "joe",
    check: jest.fn((_) => [true, "no error"]),
    submit: jest.fn(),
  },
})

const sampleFormElement = (): HTMLFormElement => {
  const elements = {
    username: {
      value: "joeshmoe",
    },
  }
  return {
    // @ts-ignore
    elements: {
      namedItem: (name) => elements[name],
    },
  }
}

test("isValid when true", async () => {
  // @ts-ignore
  const f = form(sampleFormElement(), sampleConfig())
  expect(await f.isValid()).toBe(true)
})

test("isValid when false", async () => {
  const failure = jest.fn((value) => [value === "ME", "Value is not ME"])
  const config = sampleConfig()
  // @ts-ignore
  config.username.check = failure

  const f = form(sampleFormElement(), config)

  expect(await f.isValid()).toBe(false)
  expect(f.getErrors()).toEqual([
    {
      input: {value: "joeshmoe"},
      label: "Username",
      message: "Value is not ME",
    },
  ])
})

test("submit", () => {
  const config = sampleConfig()
  const f = form(sampleFormElement(), config)

  f.submit()

  expect(config.username.submit).toHaveBeenCalledWith("joeshmoe")
})

test("a missing field", () => {
  const config = sampleConfig()
  config.username.name = "missing"
  const f = form(sampleFormElement(), config)

  return expect(f.isValid()).resolves.toBe(true)
})

test("when check returns undefined", () => {
  const config = sampleConfig()
  // @ts-ignore
  config.username.check = () => {}
  const f = form(sampleFormElement(), config)

  return expect(f.isValid()).rejects.toEqual(
    new Error(`username check did not return an array`)
  )
})
