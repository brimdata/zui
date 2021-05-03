// This is needed to use zealot outside a browser.
global.fetch = require("node-fetch")

import {execSync} from "child_process"
import path from "path"

import {createZealot} from "zealot"

import {testDataDir} from "../lib/env"
import {retryUntil} from "../lib/control"
import {nodeZedDistDir} from "../lib/env"
import {handleError} from "../lib/jest"
import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/newAppInstance"

describe("Lake tests", () => {
  let app
  let testIdx = 0
  const ZED = path.join(nodeZedDistDir(), "zed")
  const LAKE_POOL_NAME = "sample.zar"
  beforeAll(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return appStep.startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  // XXX (nibs) - skip until https://github.com/brimdata/zed/issues/2547
  test.skip(`Brim starts when a lake pool is present`, (done) => {
    appStep
      .ingestFile(app, "sample.tsv")
      .then(async () => {
        // Use zealot to
        // 1. Create a new pool
        // 2. Find the path to sample.tsv.brim's all.zng
        const client = createZealot("localhost:9867")
        const userDataDir = await app.electron.remote.app.getPath("userData")
        const lakeRoot = path.join(userDataDir, "data", "lake")
        const tsvFile = path.normalize(path.join(testDataDir(), "sample.tsv"))

        // Create a pool inside the lake.
        const options = {env: {...process.env, ZED_LAKE_ROOT: lakeRoot}}
        execSync(`"${ZED}" lake create -p default -S 1024B`, options)
        execSync(`"${ZED}" lake load -p default "${tsvFile}"`, options)

        // Make sure zed lake identifies both pools.
        retryUntil(
          () => client.pools.list(),
          (pools) => pools.length === 2
        )

        // Reload the app so that it reads the new pool.
        await appStep.reload(app)
        await appStep.click(app, ".add-tab")
        await (await app.client.$(`=${LAKE_POOL_NAME}`)).waitForDisplayed()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
