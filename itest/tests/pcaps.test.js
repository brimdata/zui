/* @flow */

import {readFileSync, readdirSync, unlinkSync} from "fs"
import md5 from "md5"
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

  stdTest(
    "Clicking on Download PCAPS from conn log entry downloads deterministically-formed PCAP file",
    (done) => {
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
          let fileBasename = dataSets.corelight.pcaps.setDurationFilename
          let pcapAbspath = path.join(pcapsDir(), fileBasename)
          expect(md5(readFileSync(pcapAbspath))).toBe(
            dataSets.corelight.pcaps.setDurationMD5
          )
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    }
  )

  stdTest(
    "Clicking on Download PCAPS with unset duration (update after fixing PROD-967)",
    (done) => {
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
    }
  )
})
