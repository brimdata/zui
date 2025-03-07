import "src/test/system/real-paths"
import {MainObject} from "../core/main/main-object"
import path from "path"

const file = `tmp-boot-test/appState.json`

test("boot starts lake with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined),
  })
  // @ts-ignore
  const main = await MainObject.boot(file, createSession)
  expect(main.lake.root).toMatch(path.normalize("data/lake"))
})
