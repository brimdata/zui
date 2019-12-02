/* @flow */

import {basename} from "path"
import {execSync} from "child_process"

import {
  getCopyForCurl,
  getDebugAst,
  logIn,
  newAppInstance,
  openCopyForCurl,
  openDebugQuery,
  resetState,
  setDebugQuery,
  setSpan,
  setSpace,
  startApp,
  startSearch,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"
import {selectors} from "../../src/js/test/integration"

const extractCurlPost = (command) => JSON.parse(command.split("'")[1])

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
    "write into main search shows Debug Query AST (update after fixing PROD-950 again and remove this clause)",
    (done) => {
      logIn(app)
        .then(() =>
          writeSearch(
            app,
            "_path=x509 | every 1d count() by certificate.version | sort ts, certificate.version"
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
          "_path=x509 | every 1d count() by certificate.version | sort ts, certificate.version"
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

  stdTest("fresh state shows default, well-formed Copy for curl", (done) => {
    logIn(app)
      .then(() => openCopyForCurl(app))
      .then(() => getCopyForCurl(app))
      .then((curlCommand) => {
        // curl must be first, and the -d ' must be on the top line for the paste
        // to work cleanly
        expect(curlCommand).toMatch(/^\s*curl[ \t]+[^\n]*-d[ \t]*'/)
        // -X POST must be concurrent non-whitespace tokens that MAY be at the
        // end
        expect(curlCommand).toMatch(/\s+-X\s+POST(?:\s+|$)/)
        // URL MAY be at the end
        expect(curlCommand).toMatch(/\s+http:\/\/[^/]+\/search(?:\s+|$)/)
        expect(extractCurlPost(curlCommand)).toBeTruthy()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("exec a curl returns process success", (done) => {
    logIn(app)
      .then(() => writeSearch(app, "* | count()"))
      .then(() => startSearch(app))
      .then(() => waitForSearch(app))
      .then(() => openCopyForCurl(app))
      .then(() => getCopyForCurl(app))
      .then((curlCommand) => {
        try {
          execSync(curlCommand, {stdio: "pipe"})
        } catch (err) {
          done(err)
        }
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest(
    "write into main search shows proper AST in Copy for curl command (update after fixing PROD-950 again and remove this clause)",
    (done) => {
      logIn(app)
        .then(() =>
          writeSearch(
            app,
            "_path=x509 | every 1d count() by certificate.version | sort ts, certificate.version"
          )
        )
        .then(() => openCopyForCurl(app))
        .then(() => getCopyForCurl(app))
        .then((curlCommand) => {
          expect(extractCurlPost(curlCommand)).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    }
  )

  stdTest("space change reflected in Copy for curl command", (done) => {
    logIn(app)
      .then(() => setSpace(app, "hq_integration"))
      .then(() => openCopyForCurl(app))
      .then(() => getCopyForCurl(app))
      .then((curlCommand) => {
        expect(extractCurlPost(curlCommand).space).toBe("hq_integration")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("span change reflected in Copy for curl command", (done) => {
    logIn(app)
      .then(() => setSpan(app, "Whole Space"))
      .then(() => openCopyForCurl(app))
      .then(() => getCopyForCurl(app))
      .then((curlCommand) => {
        expect(extractCurlPost(curlCommand).span.dur.sec).toBe(3352171)
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
