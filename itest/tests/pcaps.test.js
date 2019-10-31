/* @flow */

import md5 from "md5"

import {readFileSync, readdirSync, unlinkSync} from "fs"
import path from "path"

import {LOG} from "../lib/log"
import {
  click,
  logIn,
  newAppInstance,
  pcapsDir,
  resetState,
  searchDisplay,
  setSpan,
  startApp,
  startSearch,
  waitForSearch,
  waitUntilDownloadFinished,
  writeSearch
} from "../lib/app.js"
import {dataSets, selectors} from "../../src/js/test/integration"
import {handleError, stdTest} from "../lib/jest.js"
import contextMenu from "../lib/contextMenu"
import fixtures from "../../src/js/test/fixtures"
import mockSpace from "../../src/js/test/mockSpace"

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
  let menu

  beforeEach(() => {
    clearPcaps()
    app = newAppInstance(path.basename(__filename), ++testIdx)
    menu = contextMenu(app, "*", [], mockSpace())
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
        let program = "_path=conn duration!=nil | sort -r ts, uid"
        await logIn(app)
        await writeSearch(app, program)
        await startSearch(app)
        await waitForSearch(app)

        let field = dataSets.corelight.pcaps.setDurationUid

        menu
          .program(program)
          .click("Download PCAPS", field, fixtures.log("setDurationConn"))

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
        let program = "_path=conn duration=nil | sort -r ts, uid"
        await logIn(app)
        await writeSearch(app, program)
        await startSearch(app)
        await waitForSearch(app)

        let field = dataSets.corelight.pcaps.unsetDurationUid

        menu
          .program(program)
          .click("Download PCAPS", field, fixtures.log("unsetDurationConn"))

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

  stdTest("www.mybusinessdoc.com dosexec PCAP download", (done) => {
    const pcapFromCorrelation = async () => {
      await logIn(app)
      await setSpan(app, dataSets.corelight.logDetails.span)
      await writeSearch(app, dataSets.corelight.logDetails.initialSearch)
      await startSearch(app)
      await waitForSearch(app)
      await searchDisplay(app)

      let uid = dataSets.corelight.logDetails.getDetailsFrom
      menu.click("Open details", uid, fixtures.log("myBusinessDocHttp"))
      await click(app, selectors.correlationPanel.getText("conn"))
      await click(app, selectors.pcaps.button)
      return await waitUntilDownloadFinished(app)
    }
    pcapFromCorrelation()
      .then((downloadText) => {
        expect(downloadText).toBe("Download Complete")
        let fileBasename = dataSets.corelight.pcaps.logDetailsFilename
        let pcapAbspath = path.join(pcapsDir(), fileBasename)
        expect(md5(readFileSync(pcapAbspath))).toBe(
          dataSets.corelight.pcaps.logDetailsMD5
        )
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
