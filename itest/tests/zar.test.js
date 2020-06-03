/* @flow */

// This is needed to use zealot outside a browser.
global.fetch = require("node-fetch")

import {exec, execSync} from "child_process"
import path from "path"

import zealot from "../../src/js/services/zealot"

import {nodeZqDistDir} from "../lib/env"
import {handleError, stdTest} from "../lib/jest.js"
import {
  ingestFile,
  newAppInstance,
  startApp,
  waitForNewTab,
  waitForResults
} from "../lib/app"

describe("Zar tests", () => {
  let app
  let testIdx = 0
  const ZAR = path.join(nodeZqDistDir(), "zar")
  beforeEach(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      return await app.stop()
    }
  })

  stdTest(`Brim starts when a Zar space is present`, (done) => {
    ingestFile(app, "sample.tsv")
      .then(async () => {
        await waitForResults(app)

        // Figure out underlying space directories. One will be a
        // zarRoot. The other will be used to read zng into zar.
        const client = zealot.client("localhost:9867")

        const sampleSpace = (await client.spaces.list())[0]
        const zarSpace = await client.spaces.create({name: "sample.zar"})

        const zngFile = path.join(sampleSpace.data_path, "all.zng")
        const zarRoot = zarSpace.data_path

        // Now that the spaces are read, stop the app so we can convert
        // zarSpace to an archive store and let the app read it when it
        // restarts.
        await app.stop()

        // Create a zar archive inside the space and index some
        // interesting stuff.
        execSync(`"${ZAR}" import -s 1024B -R "${zarRoot}" "${zngFile}"`)
        await Promise.all(
          [":ip", ":port", "uid", "_path"].map((index) =>
            exec(`"${ZAR}" index -R "${zarRoot}" ${index}`)
          )
        )

        // Restart the app so that it reads the new space.
        await startApp(app)
        // There's inconsistency here on what page is presented when the
        // app restarts. Sometimes, it's the results viewer for
        // sample.tsv.brim. Other times, it's the new tab page. Instead
        // of forking off the flow further, I'm stopping any testing at
        // this point.
        // TODO: Understand why different pages appear when the app is
        // restarted.
        try {
          await waitForResults(app)
        } catch {
          await waitForNewTab(app)
        }
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
