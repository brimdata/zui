/* @flow */

import {basename} from "path"

import {
  getDebugAst,
  logIn,
  newAppInstance,
  openDebugQuery,
  resetState,
  setDebugQuery,
  startApp,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

describe("Debug and search helpers", () => {
  let app
  let testIdx = 0
  beforeEach(() => {
    app = newAppInstance(basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      await resetState(app)
      return await app.stop()
    }
  })

  stdTest("fresh state shows default Debug Query AST", (done) => {
    logIn(app)
      .then(() => openDebugQuery(app))
      .then(() => getDebugAst(app))
      .then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest(
    "write into main search shows Debug Query AST (update snapshot after fixing PROD-950)",
    (done) => {
      logIn(app)
        .then(() =>
          writeSearch(
            app,
            "_path=x509 | every 1d count() by certificate.version | sort ts, certification.version"
          )
        )
        .then(() => openDebugQuery(app))
        .then(() => getDebugAst(app))
        .then((searchResults) => {
          expect(searchResults).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    }
  )

  stdTest("write new search into Debug Query shows AST", (done) => {
    logIn(app)
      .then(() => openDebugQuery(app))
      .then(() =>
        setDebugQuery(
          app,
          "_path=x509 | every 1d count() by certificate.version | sort ts, certification.version"
        )
      )
      .then(() => getDebugAst(app))
      .then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest(
    "write invalid search into Debug Query shows reasonable error",
    (done) => {
      logIn(app)
        .then(() => openDebugQuery(app))
        .then(() => setDebugQuery(app, "* | nope()"))
        .then(() => app.client.getText(selectors.debugSearch.astError))
        .then((searchResults) => {
          expect(searchResults).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    }
  )
})
