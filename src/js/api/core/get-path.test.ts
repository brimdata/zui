import {setupApi} from "src/test/unit/helpers/setup-api"
import {app} from "electron"

app.getPath = jest.fn((name) => `/test/app/${name}`)
app.getAppPath = jest.fn(() => `/test/app`)

test("get zdeps", () => {
  const api = setupApi()

  expect(api.getPath("zdeps")).toBe("/test/app/zdeps")
})

test("get app-data", () => {
  const api = setupApi()

  expect(api.getPath("app-data")).toBe("/test/app/userData/data")
})
