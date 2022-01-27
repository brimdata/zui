import path from "path"
import {testDataDir} from "../helpers/env"
import {selectorWithText} from "../helpers/helpers"
import {poolItem} from "../helpers/locators"
import TestApp from "../helpers/test-app"
import {Readable} from "stream"
import {selectors} from "../helpers/integration"

describe("Handle Zed server events", () => {
  const app = new TestApp("Zed Events")

  beforeAll(async () => {
    await app.init()
  })
  afterAll(async () => {
    await app.shutdown()
  })

  test("pool-commit", async () => {
    await app.ingestFiles([
      path.normalize(path.join(testDataDir(), "sample.ndjson"))
    ])

    const poolId = (await app.zealot.getPools())[0].id
    const data = new Readable()
    data._read = () => {}
    const loadPromise = app.zealot.load(data, {
      pool: poolId,
      branch: "main",
      message: {
        author: "itest author",
        body: "itest body"
      }
    })
    data.push(`{"testKey": "testValue"}`)
    data.push(null)
    await loadPromise

    await app.mainWin.waitForSelector(
      selectorWithText(selectors.infoNotice, "More data is now available.")
    )
  })

  test("pool-new/update/delete/commit", async () => {
    const {
      pool: {id}
    } = await app.zealot.createPool("test-pool-new")
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-new")
    )
    await app.zealot.updatePool(id, {name: "test-pool-update"})
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-update")
    )
    await app.zealot.deletePool(id)
    await app.mainWin.waitForSelector(poolItem.css, {state: "detached"})
  })
})
