/* @noflow */

import {readFileSync, readdirSync, unlinkSync} from "fs"
import md5 from "md5"
import path from "path"

import {LOG} from "../lib/log"
import {
  click,
  clickPcapButton,
  newAppInstance,
  pcapIngestSample,
  pcapsDir,
  searchDisplay,
  startApp,
  startSearch,
  waitForSearch,
  waitUntilDownloadFinished,
  writeSearch
} from "../lib/app"
import {selectors} from "../../src/js/test/integration"
import {handleError, stdTest} from "../lib/jest"

const clearPcaps = async (app) => {
  let dir = await pcapsDir(app)
  let files = readdirSync(dir)
  files.forEach((fileBasename) => {
    if (fileBasename.match(/^packets-.+\.pcap$/)) {
      let fileAbspath = path.join(dir, fileBasename)
      unlinkSync(fileAbspath)
      LOG.debug(`Unlinked file ${fileAbspath}`)
    }
  })
}

describe("Test PCAPs", () => {
  let app
  let testIdx = 0

  beforeEach(async () => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    await startApp(app)
    await clearPcaps(app)
    return pcapIngestSample(app)
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest(
    "pcap button downloads deterministically-formed pcap file",
    (done) => {
      writeSearch(
        app,
        "_path=ssl id.orig_h=192.168.1.110 id.resp_h=209.216.230.240 id.resp_p=443"
      )
        .then(async () => {
          await startSearch(app)
          await waitForSearch(app)
          await searchDisplay(app)
          await click(app, selectors.viewer.resultCellContaining("ssl"))
          await clickPcapButton(app)
          let downloadText = await waitUntilDownloadFinished(app)
          expect(downloadText).toBe("Download Complete")
          const fileBasename = "packets-1582646593.996366.pcap"
          let pcapAbspath = path.join(await pcapsDir(app), fileBasename)
          expect(md5(readFileSync(pcapAbspath))).toBe(
            "888453c81738fd8ade4c7f9888d86f86"
          )
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    }
  )

  stdTest("pcap download works for null duration", (done) => {
    writeSearch(app, "duration=null id.orig_p=47783")
      .then(async () => {
        await startSearch(app)
        await waitForSearch(app)
        await searchDisplay(app)
        await click(app, selectors.viewer.resultCellContaining("conn"))
        await clickPcapButton(app)
        let downloadText = await waitUntilDownloadFinished(app)
        expect(downloadText).toBe("Download Complete")
        const fileBasename = "packets-1582646589.440467.pcap"
        let pcapAbspath = path.join(await pcapsDir(app), fileBasename)
        expect(md5(readFileSync(pcapAbspath))).toBe(
          "678442857027fdc5ad1e3418614dcdb8"
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
