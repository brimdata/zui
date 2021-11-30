import path from "path"
import {testDataDir} from "../helpers/env"
import {selectorWithText} from "../helpers/helpers"
import {poolItem} from "../../integration/helpers/locators"
import TestApp from "../helpers/test-app"
import {Readable} from "stream"
import {selectors} from "../../integration/helpers/integration"

describe("Handle Zed server events", () => {
  const app = new TestApp("Zed Events")

  beforeEach(async () => {
    await app.init()
  })
  afterEach(async () => {
    await app.shutdown()
  })

  test("branch-commit", async () => {
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

  test("pool-new/update/delete", async () => {
    const {
      pool: {id}
    } = await app.zealot.pools.create({name: "test-pool-new"})
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-new")
    )
    await app.zealot.pools.update(id, {name: "test-pool-update"})
    await app.mainWin.waitForSelector(
      selectorWithText(poolItem.css, "test-pool-update")
    )
    await app.zealot.pools.delete(id)
    await app.mainWin.waitForSelector(poolItem.css, {state: "detached"})
  })
})
