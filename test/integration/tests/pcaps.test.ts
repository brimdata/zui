import {readFileSync, readdirSync, unlinkSync} from "fs"
import md5 from "md5"
import path from "path"

import {LOG} from "../helpers/log"
import appStep from "../helpers/appStep/api"
import {pcapsDir} from "../helpers/appStep/api/savePcap"
import {runSearch} from "../helpers/appStep/api/search"
import newAppInstance from "../helpers/newAppInstance"
import {selectors} from "../../../src/js/test/integration"
import {handleError} from "../helpers/jest"

const clearPcaps = async (app) => {
  const dir = await pcapsDir(app)
  const files = readdirSync(dir)
  files.forEach((fileBasename) => {
    if (fileBasename.match(/^packets-.+\.pcap$/)) {
      const fileAbspath = path.join(dir, fileBasename)
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
    await appStep.startApp(app)
    await clearPcaps(app)
    return appStep.ingestFile(app, "sample.pcap")
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  test("pcap button downloads deterministically-formed pcap file", (done) => {
    runSearch(
      app,
      '_path=="ssl" id.orig_h==192.168.1.110 id.resp_h==209.216.230.240 id.resp_p==443'
    )
      .then(async () => {
        await appStep.click(app, selectors.viewer.resultCellContaining("ssl"))
        await appStep.savePcap(app)
        const fileBasename = "packets-2020-02-25T16_03_13.996366Z.pcap"
        const pcapAbspath = path.join(await pcapsDir(app), fileBasename)
        expect(md5(readFileSync(pcapAbspath))).toBe(
          "888453c81738fd8ade4c7f9888d86f86"
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  test("pcap download works for null duration", (done) => {
    runSearch(app, "duration==null id.orig_p==47783")
      .then(async () => {
        await appStep.click(app, selectors.viewer.resultCellContaining("conn"))
        await appStep.savePcap(app)
        const fileBasename = "packets-2020-02-25T16_03_09.440467Z.pcap"
        const pcapAbspath = path.join(await pcapsDir(app), fileBasename)
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
