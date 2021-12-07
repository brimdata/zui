import path from "path"
import {testDataDir} from "../helpers/env"
import {selectorWithText} from "../helpers/helpers"
import {poolItem} from "../../integration/helpers/locators"
import TestApp from "../helpers/test-app"
import {Readable} from "stream"
import {selectors} from "../../integration/helpers/integration"

describe("Handle Zed server events", () => {
  const app = new TestApp("Zed Events")

  beforeAll(async () => {
    await app.init()
  })
  afterAll(async () => {
    await app.shutdown()
  })

  test("pool-new/update/delete/commit", async () => {
    const [
      {
        pool: {id}
      }
    ] = await Promise.all([
      app.zealot.pools.create({name: "test-pool-new"}),
      app.mainWin.waitForSelector(
        selectorWithText(poolItem.css, "test-pool-new")
      )
    ])
    await Promise.all([
      app.mainWin.waitForSelector(
        selectorWithText(poolItem.css, "test-pool-update")
      ),
      app.zealot.pools.update(id, {name: "test-pool-update"})
    ])
    await Promise.all([
      app.zealot.pools.delete(id),
      app.mainWin.waitForSelector(poolItem.css, {state: "detached"})
    ])
    await app.ingestFiles([
      path.normalize(path.join(testDataDir(), "sample.ndjson"))
    ])
    const poolId = (await app.zealot.pools.list())[0].id
    const data = new Readable()
    data._read = () => {}
    const loadPromise = app.zealot.pools.load(poolId, "main", {
      author: "itest author",
      body: "itest body",
      data
    })
    data.push(`{"testKey": "testValue"}`)
    data.push(null)
    await loadPromise

    await app.mainWin.waitForSelector(
      selectorWithText(selectors.infoNotice, "More data is now available.")
    )
  })
})
