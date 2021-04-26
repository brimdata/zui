import {Brim} from "./brim"
import path from "path"

const file = `tmp-boot-test/appState.json`

test("boot starts lake with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined)
  })
  // @ts-ignore
  const brim = await Brim.boot(file, createSession)
  expect(brim.lake.root).toBe(path.normalize("/fake/path/data/lake"))
})
