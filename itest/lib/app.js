/* @flow */
const electronPath = require("electron")

import {Application} from "spectron"
import * as path from "path"

import {downloadsDir} from "../../src/js/lib/System"
import {selectors} from "../../src/js/test/integration"
import {LOG} from "./log"
import {workspaceLogfile} from "../lib/log"
import {retryUntil} from "./control"

const appStep = async (stepMessage, f) => {
  LOG.debug(`Starting step "${stepMessage}"`)
  let result = await f()
  LOG.debug(`Finished step "${stepMessage}"`)
  return result
}

export const newAppInstance = (name: string, idx: number) =>
  // https://github.com/electron-userland/spectron#new-applicationoptions
  new Application({
    path: electronPath,
    args: [path.join(__dirname, "..", "..")],
    // PROD-853: Spectron will choose a random debugging port in the 9000-9999
    // range. Since boomd uses 9867, set this to 9999.
    chromeDriverArgs: ["remote-debugging-port=9999"],
    startTimeout: 60000,
    waitTimeout: 60000,
    chromeDriverLogPath: workspaceLogfile(
      name + idx.toString() + "-chromedriver.log"
    ),
    webdriverLogPath: workspaceLogfile(name + "-webdriverLogFiles"),
    // PROD-831: Latest compatible spectron and webdriverio lead to the
    // following:
    //  console.warn node_modules/webdriverio/build/lib/helpers/deprecationWarning.js:12
    //    WARNING: the "<cmd>" command will be deprecated soon. If you have further questions, reach out in the WebdriverIO Gitter support channel (https://gitter.im/webdriverio/webdriverio).
    //    Note: This command is not part of the W3C WebDriver spec and won't be supported in future versions of the driver. It is recommended to use the actions command to emulate pointer events.
    //
    //    (You can disable this warning by setting `"deprecationWarnings": false` in your WebdriverIO config)
    // for <cmd> in the following:
    //   buttonPress
    //   moveTo
    // Test code isn't using these directly according to git grep, which
    // means this is something one of my dependencies must fix. Ignore the
    // warnings for now.
    webdriverOptions: {
      deprecationWarnings: false
    }
  })

export const startApp = async (app: Application) => {
  await appStep("starting app", () => app.start())
  return await resetState(app)
}

export const waitForLoginAvailable = (app: Application) => {
  // Wait for login elements to exist. In most cases this is taken care of for
  // you in logIn() however if you need to inspect those elements before
  // logging in, use this first.
  const waitForHostname = () => {
    return app.client.waitForVisible(selectors.login.host)
  }

  const waitForButton = () => {
    return app.client.waitForVisible(selectors.login.button)
  }
  return appStep("wait for hostname, port, and login widget", () =>
    waitForHostname().then(() => waitForButton())
  )
}

export const logIn = (app: Application) => {
  // Wait for necessary login widgets and then log in. Then make sure the app
  // is ostensibly ready before continuing. This method is suitable for most
  // test procedures.
  return waitForLoginAvailable(app)
    .then(() =>
      appStep("fill out login page and log in", () =>
        // WebdriverV4 doesn't return promises for these methods. Instead they can
        // be chained together.
        app.client
          .setValue(selectors.login.host, "localhost:9867")
          .click(selectors.login.button)
      )
    )
    .then(() => waitForSearch(app))
    .then(() => waitForHistogram(app))
}

export const resetState = (app: Application) =>
  appStep("reset state", () => app.webContents.send("resetState"))

export const waitForSearch = (app: Application) => {
  return appStep(
    "wait for main search input to appear and then get its value",
    () =>
      app.client
        .waitForVisible(selectors.search.input)
        .then(() => app.client.element(selectors.search.input).getValue())
  )
}

export const waitForHistogram = (app: Application) => {
  return appStep("wait for base histogram element hierarchy", () =>
    app.client
      .waitForVisible(selectors.histogram.topLevel)
      .then(() =>
        app.client.element(selectors.histogram.topLevel).getAttribute("class")
      )
  )
}

export const writeSearch = (app: Application, searchText: string) =>
  appStep("write to main search", () =>
    app.client
      .waitForVisible(selectors.search.input)
      .then(() => app.client.setValue(selectors.search.input, searchText))
  )

export const getSearchText = (app: Application): Promise<string> =>
  appStep("get contents of main search", () =>
    app.client
      .waitForVisible(selectors.search.input)
      .then(() => app.client.getValue(selectors.search.input))
  )

export const startSearch = (app: Application) =>
  appStep("click the search button", () => app.client.keys("Enter"))

export const searchDisplay = async (app: Application) => {
  // This stinks. We have to use getHTML because headers that are off the
  // screen return as empty strings if you use getText. This isn't required of
  // actual results.
  // See http://v4.webdriver.io/api/property/getText.html
  // app.browserWindow.maximize() fixes the problem on my laptop but not CircleCI.
  // But what we get back includes the width which can be non-deterministic:
  // <div class="header-cell" style="width: 192px;">ts<div class="col-resizer"></div></div>
  // That style width will vary on my laptop vs. CircleCI.
  // The hack is to split this and extract just the text.
  const _trim = (s: string) => s.split(">")[1].split("<")[0]

  const headerResults = () => {
    return appStep("get search fields", () =>
      app.client
        .waitForVisible(selectors.viewer.headers)
        .then(() => app.client.getHTML(selectors.viewer.headers))
    ).then((headers) => {
      if (typeof headers === "string") {
        headers = [headers]
      }
      return headers.map((h) => _trim(h))
    })
  }
  const searchResults = () =>
    appStep("get search tuples", () =>
      app.client
        .waitForVisible(selectors.viewer.results)
        .then(() => app.client.getText(selectors.viewer.results))
    )

  let headers = await headerResults()
  let search = await searchResults()
  // $FlowFixMe
  return headers.concat(search)
}

export const getCurrentSpace = (app: Application) =>
  appStep("get the current space", () =>
    app.client
      .waitForVisible(selectors.spaces.button)
      .then(() => app.client.getText(selectors.spaces.button))
  )

export const setSpace = (app: Application, space: string) =>
  appStep(`set space to "${space}"`, () =>
    app.client
      .waitForVisible(selectors.spaces.button)
      .then(() => app.client.click(selectors.spaces.button))
      .then(() => app.client.waitForVisible(selectors.spaces.menuItem(space)))
      .then(() => app.client.click(selectors.spaces.menuItem(space)))
  )

const getSearchStat = (app: Application, selector: string) =>
  appStep(`get search stats for selector "${selector}"`, () =>
    app.client
      .waitForVisible(selector)
      .then(() => app.client.getText(selector))
      .then((text) => parseFloat(text.split(" ")[0]))
  )

export const getSearchSpeed = (app: Application) =>
  getSearchStat(app, selectors.search.speed)

export const getSearchTime = (app: Application) =>
  getSearchStat(app, selectors.search.time)

export const setSpan = (app: Application, span: string) => {
  const clickSpanButton = () =>
    appStep("click span selector", () =>
      app.client
        .waitForVisible(selectors.span.button)
        .then(() => app.client.click(selectors.span.button))
    )

  const clickSpan = () =>
    appStep(`select span ${span}`, () =>
      app.client
        .waitForVisible(selectors.span.menuItem(span))
        .then(() => app.client.click(selectors.span.menuItem(span)))
    )

  return clickSpanButton().then(() => clickSpan())
}

export const click = (app: Application, selector: string) =>
  appStep(`click on selector "${selector}"`, () =>
    app.client.waitForVisible(selector).then(() => app.client.click(selector))
  )

export const rightClick = (app: Application, selector: string) =>
  appStep(`right-click on selector "${selector}"`, () =>
    app.client
      .waitForVisible(selector)
      .then(() => app.client.rightClick(selector))
  )

export const openDebugQuery = async (app: Application) => {
  await click(app, selectors.options.button)
  await click(app, selectors.options.menuItem("Debug query"))
  await appStep("wait for Debug Query modal to appear", () =>
    Promise.all([
      app.client.waitForVisible(selectors.debugSearch.search),
      app.client.waitForVisible(selectors.debugSearch.ast),
      app.client.waitForVisible(selectors.debugSearch.done)
    ])
  )
}

export const setDebugQuery = (app: Application, searchText: string) =>
  app.client.setValue(selectors.debugSearch.search, searchText)

export const getDebugAst = (app: Application) =>
  app.client
    .getText(selectors.debugSearch.ast)
    .then((astText) => JSON.parse(astText.join("")))

export const waitUntilDownloadFinished = async (app: Application) =>
  await appStep("wait for a download to finish", async () => {
    await app.client.waitForVisible(selectors.downloadMessage)
    return await retryUntil(
      () => app.client.getText(selectors.downloadMessage),
      (text) => text == "Download Complete" || text.includes("Download error")
    )
  })

export const pcapsDir = () => downloadsDir()
