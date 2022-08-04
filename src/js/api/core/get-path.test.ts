import {setupApi} from "src/test/unit/helpers/setup-api"
import {app} from "electron"
import {normalize} from "path"

app.getPath = jest.fn((name) => normalize(`/test/app/${name}`))
app.getAppPath = jest.fn(() => normalize(`/test/app`))

test("get zdeps", () => {
  const api = setupApi()

  expect(api.getPath("zdeps")).toBe(normalize("/test/app/zdeps"))
})

test("get app-data", () => {
  const api = setupApi()

  expect(api.getPath("app-data")).toBe(normalize("/test/app/userData/data"))
})
