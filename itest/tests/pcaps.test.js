/* @flow */

import {readdirSync, unlinkSync} from "fs"
import path from "path"

import {
  click,
  logIn,
  newAppInstance,
  pcapsDir,
  resetState,
  rightClick,
  startApp,
  startSearch,
  waitForSearch,
  waitUntilDownloadFinished,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {LOG} from "../lib/log"
import {dataSets, selectors} from "../../src/js/test/integration"

const clearPcaps = () => {
  let files = readdirSync(pcapsDir())
  files.forEach((fileBasename) => {
    if (fileBasename.match(/^packets-.+\.pcap$/)) {
      let fileAbspath = path.join(pcapsDir(), fileBasename)
      unlinkSync(fileAbspath)
      LOG.debug(`Unlinked file ${fileAbspath}`)
    }
  })
}

describe("Test PCAPs", () => {
  let app
  let testIdx = 0
  beforeEach(() => {
    clearPcaps()
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    clearPcaps()
    if (app && app.isRunning()) {
      await resetState(app)
      return await app.stop()
    }
  })

  stdTest("Download PCAPS menu item appears with conn log items", (done) => {
    let getRightClickFromConnTuple = async () => {
      await logIn(app)
      await writeSearch(app, "_path=conn duration!=nil | sort -r ts, uid")
      await startSearch(app)
      await waitForSearch(app)
      return await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.pcaps.setDurationUid
        )
      )
    }
    getRightClickFromConnTuple()
      .then(async () => {
        await app.client.waitForVisible(
          selectors.viewer.rightClickMenuItem("Download PCAPS")
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("Clicking on Download PCAPS reports Download Succeeded", (done) => {
    let downloadPcapFromConnTuple = async () => {
      await logIn(app)
      await writeSearch(app, "_path=conn duration!=nil | sort -r ts, uid")
      await startSearch(app)
      await waitForSearch(app)
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.pcaps.setDurationUid
        )
      )
      await click(app, selectors.viewer.rightClickMenuItem("Download PCAPS"))
      return await waitUntilDownloadFinished(app)
    }
    downloadPcapFromConnTuple()
      .then((downloadText) => {
        expect(downloadText).toBe("Download Complete")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("Clicking on Download PCAPS with unset duration", (done) => {
    // This is a failing test that, once PROD-967 is fixed, can be updated.
    // It's left on because I can't fix/disable it, and I want to call
    // attention to getting it fixed right away.
    let downloadPcapFromConnTuple = async () => {
      await logIn(app)
      await writeSearch(app, "_path=conn duration=nil | sort -r ts, uid")
      await startSearch(app)
      await waitForSearch(app)
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.pcaps.unsetDurationUid
        )
      )
      await click(app, selectors.viewer.rightClickMenuItem("Download PCAPS"))
      return await waitUntilDownloadFinished(app)
    }
    downloadPcapFromConnTuple()
      .then((downloadText) => {
        expect(downloadText).toBe("Download error: Bad Request")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
