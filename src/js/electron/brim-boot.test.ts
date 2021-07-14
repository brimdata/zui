import {BrimMain} from "./brim"
import path from "path"

const file = `tmp-boot-test/appState.json`

test("boot starts lake with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined)
  })
  // @ts-ignore
  const brim = await BrimMain.boot(file, createSession)
  expect(brim.lake.root).toMatch(path.normalize("data/lake"))
})
