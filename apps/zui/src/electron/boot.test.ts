import "src/test/system/real-paths"
import {ZuiMain} from "./zui-main"
import path from "path"

const file = `tmp-boot-test/appState.json`

test("boot starts lake with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined),
  })
  // @ts-ignore
  const main = await ZuiMain.boot(file, createSession)
  expect(main.lake.root).toMatch(path.normalize("data/lake"))
})
