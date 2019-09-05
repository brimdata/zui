/* @flow */

import {
  click,
  startApp,
  getSearchText,
  logIn,
  newAppInstance,
  rightClick,
  searchDisplay,
  setSpan,
  startSearch,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {retry} from "../lib/control"
import {handleError, stdTest} from "../lib/jest.js"
import {dataSets, selectors} from "../../src/js/test/integration"

describe("Test search mods via right-clicks", () => {
  let app
  beforeEach(() => {
    app = newAppInstance()
    return startApp(app)
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  stdTest("Include / Exclude this value works", (done) => {
    let includeExcludeFlow = async () => {
      await logIn(app)
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.rightClickSearch.includeValue
        )
      )
      await click(
        app,
        selectors.viewer.rightClickMenuItem("Include this value")
      )
      await rightClick(app, selectors.viewer.resultCellContaining("conn"))
      await click(
        app,
        selectors.viewer.rightClickMenuItem("Exclude this value")
      )
      // The result order is deterministic because clicked a uid and then
      // removed its conn log entry.
      return searchDisplay(app)
    }
    includeExcludeFlow()
      .then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("Use as start/end time works", (done) => {
    let startEndFlow = async () => {
      await logIn(app)
      // The sort proc is used here to ensure that the two tuples that appear
      // with the same timestamp are deterministically sorted.  If PROD-647
      // is fixed, the results will still be deterministic because, although
      // two points with the same ts appear, they will be sorted by uid as
      // well.
      await writeSearch(app, "_path=conn | sort -r ts, uid")
      await startSearch(app)
      await waitForSearch(app)
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.rightClickSearch.startTime
        )
      )
      await click(
        app,
        selectors.viewer.rightClickMenuItem('Use as "start" time')
      )
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.rightClickSearch.endTime
        )
      )
      await click(app, selectors.viewer.rightClickMenuItem('Use as "end" time'))
      // The result order is deterministic because of the sort proc as
      // explained above.
      return searchDisplay(app)
    }
    startEndFlow()
      .then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("New Search works", (done) => {
    let newSearchFlow = async () => {
      await logIn(app)
      await rightClick(
        app,
        selectors.viewer.resultCellContaining(
          dataSets.corelight.rightClickSearch.newSearchSetup
        )
      )
      await click(
        app,
        selectors.viewer.rightClickMenuItem("Include this value")
      )
      await rightClick(app, selectors.viewer.resultCellContaining("weird"))
      await click(
        app,
        selectors.viewer.rightClickMenuItem("New search with this value")
      )
      // The result order is deterministic because all the points rendered have
      // different ts values.
      return searchDisplay(app)
    }
    newSearchFlow()
      .then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
      })
      // This section verifies the previous search was cleared in favor of
      // the new search "weird".
      .then(() => getSearchText(app))
      .then((searchText) => {
        expect(searchText).toBe('"weird"')
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })

  stdTest("Count by / Pivot to logs works", (done) => {
    let pivotToLogsFlow = async () => {
      await logIn(app)
      // If we want to "Count by" _path, we *must* select a conn cell,
      // because conn logs contain the _path of the connection. Searching for
      // "dns" will find either the first conn log tuple of a dns connection,
      // or the first dns log tuple of the same.
      await rightClick(app, selectors.viewer.resultCellContaining("conn"))
      await click(app, selectors.viewer.rightClickMenuItem("Count by _path"))
      await rightClick(app, selectors.viewer.resultCellContaining("dhcp"))
      await click(app, selectors.viewer.rightClickMenuItem("Pivot to logs"))
      // The result order is deterministic because all the points rendered have
      // different ts values.
      return searchDisplay(app)
    }
    pivotToLogsFlow().then((searchResults) => {
      expect(searchResults).toMatchSnapshot()
      done()
    })
  })

  stdTest("conn for www.mybusinessdoc.com is found via correlation", (done) => {
    logIn(app)
      .then(() => setSpan(app, dataSets.corelight.logDetails.span))
      .then(() => writeSearch(app, dataSets.corelight.logDetails.initialSearch))
      .then(() => startSearch(app))
      .then(() => waitForSearch(app))
      .then(() => searchDisplay(app))
      // Search is deterministic because all tuples have different ts
      .then((results) => {
        expect(results).toMatchSnapshot()
      })
      .then(() =>
        rightClick(
          app,
          selectors.viewer.resultCellContaining(
            dataSets.corelight.logDetails.getDetailsFrom
          )
        )
      )
      .then(() =>
        click(app, selectors.viewer.rightClickMenuItem("Open details"))
      )
      .then(() =>
        Promise.all([
          retry(() => app.client.getText(selectors.correlationPanel.tsLabel)),
          retry(() => app.client.getText(selectors.correlationPanel.pathTag)),
          retry(() =>
            app.client.getText(selectors.correlationPanel.duration)
          ).then((result) => [result])
        ])
      )
      .then((correlationData) => {
        expect(correlationData).toMatchSnapshot()
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
