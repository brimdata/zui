import {Brim} from "./brim"

const path = `tmp-boot-test/appState.json`

test("boot starts zqd with defaults", async () => {
  const createSession = () => ({
    load: () => Promise.resolve(undefined)
  })
  // @ts-ignore
  const brim = await Brim.boot(path, createSession)
  expect(brim.zqd.root).toBe("/fake/path/data/spaces")
  expect(brim.zqd.suricataRunner).toBe("")
  expect(brim.zqd.suricataUpdater).toBe("")
  expect(brim.zqd.zeekRunner).toBe("")
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
