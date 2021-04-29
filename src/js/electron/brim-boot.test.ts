import {Brim} from "./brim"
import path from "path"

const file = `tmp-boot-test/appState.json`

test("boot starts zqd with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined)
  })
  // @ts-ignore
  const brim = await Brim.boot(file, createSession)
  expect(brim.zqd.root).toBe(path.normalize("/fake/path/data/spaces"))
})

test("gets global state from store", async () => {
  const createSession = () => ({
    load: () =>
      Promise.resolve({
        globalState: {
          prefs: {
            zeekRunner: "testing123"
          }
        }
      })
  })
  // @ts-ignore
  const brim = await Brim.boot(path, createSession)
  expect(brim.store.getState().prefs.zeekRunner).toEqual("testing123")
})
