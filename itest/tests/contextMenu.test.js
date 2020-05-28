/* @flow */

import {basename} from "path"
import {sprintf} from "sprintf-js"

import {
  click,
  ingestFile,
  newAppInstance,
  rightClick,
  searchDisplay,
  setSpan,
  startApp,
  startSearch,
  waitForResults,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

// Fields we can test in types.tsv
const FIELDS = ["scalar", "record.scalar"]
// Brim character that represents an unset zng value. It must be
// handled specially as it can be a string value or the unset
// representation. That representation is only used to find a cell, or
// to exclude the actual character from search results.
const UNSET = "⦻"
const STRINGS = [
  "mystr",
  "\\x2d",
  "\\x09",
  '"',
  "'",
  ",",
  ";",
  "∫£œßü™",
  '"mystr"',
  "'mystr'",
  "*",
  '"*"',
  "1.1.1.1",
  " ",
  "null",
  "⦻" // The actual character, not unset.
]
const ADDRS = ["1.1.1.1", "fe80::58d2:2d09:e8cb:a8ad", "::"]

describe("type-wise Filter = value searches", () => {
  let app

  beforeAll(async () => {
    app = newAppInstance(basename(__filename) + "-types", 0)
    await startApp(app)
    await ingestFile(app, "types.tsv")
    await setSpan(app, "Whole Space")
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  stdTest("FilterEq ensure ingest", (done) => {
    writeSearch(app, `* | count() by _path | sort _path`)
      .then(async () => {
        await startSearch(app)
        expect(await searchDisplay(app)).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  const run = (path: string, values: string[]) => {
    let testIdx = 0
    let testId: string
    FIELDS.forEach((fieldName) => {
      values.forEach((s) => {
        testId = sprintf("%04d", testIdx++)
        stdTest(`FilterEq${testId}: ${path} ${fieldName}="${s}"`, (done) => {
          writeSearch(
            app,
            `_path=${path} ${fieldName}!=null | cut id, ${fieldName}`
          )
            .then(async () => {
              await startSearch(app)
              await waitForResults(app)
              rightClick(app, selectors.viewer.resultCellContaining(s))
              await click(
                app,
                selectors.viewer.contextMenuItem("Filter = value")
              )
              expect(await searchDisplay(app)).toMatchSnapshot()
              done()
            })
            .catch((err) => {
              handleError(app, err, done)
            })
        })
      })
    })
  }
  run("string", STRINGS)

  stdTest(`FilterEq unset/${UNSET} string`, (done) => {
    writeSearch(app, `_path=string | cut id, scalar | sort -r id | head 10`)
      .then(async () => {
        await startSearch(app)
        await waitForResults(app)
        rightClick(app, selectors.viewer.resultCellContaining(UNSET))
        await click(app, selectors.viewer.contextMenuItem("Filter = value"))
        expect(await searchDisplay(app)).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  run("addr", ADDRS)
})
