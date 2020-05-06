/* @flow */

import {writeFileSync, mkdirpSync} from "fs-extra"

import {Application} from "spectron"
import crypto from "crypto"
import electronPath from "electron"
import path from "path"

import {LOG} from "./log"
import {isCI, repoDir} from "../lib/env"
import {itestDir} from "./env"
import {retryUntil} from "./control"
import {selectors} from "../../src/js/test/integration"

const appStep = async (stepMessage, f) => {
  LOG.debug(`Starting step "${stepMessage}"`)
  let result = await f()
  LOG.debug(`Finished step "${stepMessage}"`)
  return result
}

export const newAppInstance = (name: string, idx: number): Application => {
  const macInstallPath = "/Applications/Brim.app/Contents/MacOS/Brim"
  const linuxInstallPath = "/usr/bin/brim"
  const userDataDir = path.resolve(path.join(itestDir(), name, idx.toString()))
  mkdirpSync(userDataDir)

  // https://github.com/electron-userland/spectron#new-applicationoptions
  let appArgs = {
    chromeDriverArgs: [`--user-data-dir=${userDataDir}`],
    startTimeout: 60000,
    waitTimeout: 60000,
    chromeDriverLogPath: path.join(userDataDir, "chromedriver.log"),
    webdriverLogPath: path.join(userDataDir, "webdriverLogFiles"),
    // Latest compatible spectron and webdriverio lead to the
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
  }

  if (isCI() && process.platform === "darwin") {
    appArgs = {...appArgs, path: macInstallPath}
    LOG.debug("Chose installed MacOS app location", macInstallPath)
  } else if (isCI() && process.platform === "linux") {
    appArgs = {...appArgs, path: linuxInstallPath}
    LOG.debug("Chose installed Linux app location", linuxInstallPath)
  } else {
    appArgs = {...appArgs, path: electronPath, args: [repoDir()]}
    LOG.debug("Chose working copy app location", electronPath)
  }
  return new Application(appArgs)
}

export const startApp = async (app: Application) => {
  await appStep("starting app", () => app.start())
}

export const resetState = (app: Application) =>
  appStep("reset state", () => app.webContents.send("resetState"))

export const showPreferences = (app: Application) =>
  appStep("show preferences", () => app.webContents.send("showPreferences"))

export const showAbout = (app: Application) =>
  appStep("show about", () => app.webContents.send("showAbout"))

export const waitForSearch = (app: Application) => {
  return appStep(
    "wait for main search input to appear and then get its value",
    () =>
      app.client
        .waitForVisible(selectors.search.input)
        .then(() => app.client.element(selectors.search.input).getValue())
  )
}

export const waitForNewTab = (app: Application) => {
  return appStep("wait for new tab to appear", () =>
    app.client.waitForVisible(selectors.ingest.filesButton)
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

export const searchDisplayHeaders = async (app: Application) => {
  // This stinks. We have to use getHTML because headers that are off the
  // screen return as empty strings if you use getText. This isn't required of
  // actual results.
  // See http://v4.webdriver.io/api/property/getText.html
  // app.browserWindow.maximize() fixes the problem on my laptop but not CI.
  // But what we get back includes the width which can be non-deterministic:
  // <div class="header-cell" style="width: 192px;">ts<div class="col-resizer"></div></div>
  // That style width will vary on my laptop vs. CI.
  // The hack is to split this and extract just the text.
  const _trim = (s: string) => s.split(">")[1].split("<")[0]

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

export const searchDisplay = async (
  app: Application,
  includeHeaders: boolean = true
) => {
  const searchResults = () =>
    appStep("get search tuples", () =>
      app.client
        .waitForVisible(selectors.viewer.results)
        .then(() => app.client.getText(selectors.viewer.results))
    )

  let headers = ""
  if (includeHeaders) {
    headers = await searchDisplayHeaders(app)
  }
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
  appStep(`set space to "${space}"`, async () => {
    await click(app, selectors.spaces.button)
    await click(app, selectors.spaces.menuItem(space))
  })

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

export const setSpan = async (app: Application, span: string) => {
  await appStep("click span selector", () => click(app, selectors.span.button))
  await appStep(`select span ${span}`, () =>
    click(app, selectors.span.menuItem(span))
  )
}

const waitForClickable = async (app: Application, selector: string) => {
  // In testing, it's been shown than there is no need to scroll to
  // elements to make them be visible, as long as the element's
  // container allows scrolling. However, some Internet searches suggest
  // scrolling to the element before trying to click in order to avoid
  // problems like those described in
  // https://github.com/brimsec/brim/issues/668
  await appStep(`wait for element to exist: "${selector}"`, () =>
    app.client.waitForExist(selector)
  )
  await appStep(`wait for element to be visible: "${selector}"`, () =>
    app.client.waitForVisible(selector)
  )
  await appStep(`scroll to: "${selector}"`, () => app.client.scroll(selector))
}

export const click = (app: Application, selector: string) =>
  appStep(`click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)
    try {
      await retryUntil(
        () => app.client.click(selector),
        (success) => success
      )
    } catch (e) {
      LOG.debug("trying to execute script for click: " + e)
      await app.client.selectorExecute(selector, (elem) => {
        elem.click()
      })
    }
  })

export const rightClick = (app: Application, selector: string) =>
  appStep(`right-click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)
    try {
      await retryUntil(
        () => app.client.rightClick(selector),
        (success) => success
      )
    } catch (e) {
      LOG.debug("trying to execute script for rightClick: " + e)
      await app.client.selectorExecute(selector, (elem) => {
        elem.rightClick()
      })
    }
  })

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

export const killSearch = async (app: Application) => {
  await click(app, selectors.options.button)
  await click(app, selectors.options.menuItem("Kill search"))
}

export const setDebugQuery = (app: Application, searchText: string) => {
  let selector = selectors.debugSearch.search
  // React "blur" events prevents this input from being cleared
  return app.client
    .getValue(selector)
    .then((value) => "\uE003".repeat(value.length))
    .then((backspaces) =>
      app.client.setValue(selector, backspaces + searchText)
    )
}

export const getDebugAst = (app: Application) =>
  app.client
    .getText(selectors.debugSearch.ast)
    .then((astText) => JSON.parse(astText.join("")))

export const openCopyForCurl = async (app: Application) => {
  await click(app, selectors.options.button)
  await click(app, selectors.options.menuItem("Copy for curl"))
  await appStep("wait for Copy for curl modal to appear", () =>
    Promise.all([
      app.client.waitForVisible(selectors.cliHelp.curlModal),
      app.client.waitForVisible(selectors.cliHelp.curlCommand)
    ])
  )
}

export const getCopyForCurl = (app: Application) =>
  app.client.getText(selectors.cliHelp.curlCommand)

export const waitUntilDownloadFinished = async (app: Application) =>
  await appStep("wait for a download to finish", async () => {
    await app.client.waitForVisible(selectors.downloadMessage)
    return await retryUntil(
      () => app.client.getText(selectors.downloadMessage),
      (text) => text == "Download Complete" || text.includes("Download error")
    )
  })

export const pcapsDir = async (app: Application) =>
  await app.electron.remote.app.getPath("temp")

export const toggleOptimizations = async (app: Application) => {
  // Stateless toggle of optimizations. If you use this twice after reset
  // state, both will be back to their original state. This is only used to
  // disabled optimizations, which is why it's not state-aware.
  await showPreferences(app)
  await appStep("wait for Preferences modal to appear", () =>
    Promise.all(
      Object.values(selectors.settings).map((item) =>
        app.client.waitForVisible(item)
      )
    )
  )
  await appStep("toggle optimizations", () =>
    Promise.all([
      click(app, selectors.settings.useCacheToggle),
      click(app, selectors.settings.useIndexToggle)
    ])
  )
  await click(app, selectors.settings.button)
}

export const waitForResults = (app: Application) =>
  appStep("wait for results viewer to appear", () =>
    app.client.waitForVisible(selectors.viewer.results_base)
  )

export const pcapIngestSample = async (app: Application) => {
  // Ingest a PCAP and wait until we see derived records.
  await ingestFile(
    app,
    path.normalize(path.join(__dirname, "..", "sample.pcap"))
  )
}

export const ingestFile = async (app: Application, file: string) => {
  await appStep("wait for pcap file input", () =>
    app.client.waitForVisible(selectors.ingest.filesButton)
  )
  await appStep("choose file", () =>
    app.client.chooseFile(selectors.ingest.filesInput, file)
  )

  await appStep("wait for ingest to finish", () =>
    retryUntil(
      () => app.client.isExisting(selectors.status.ingestProgress),
      (ingesting) => ingesting === false
    )
  )

  await waitForResults(app)
}

export const takeScreenshot = async (app: Application) => {
  try {
    let image = await app.browserWindow.capturePage()
    let filePath = path.join(
      itestDir(),
      "failure-" + crypto.randomBytes(4).toString("hex") + ".png"
    )
    writeFileSync(filePath, image)
    LOG.info(`wrote out screen shot to "${filePath}"`)
  } catch (e) {
    LOG.error("unable to take screen shot: " + e)
  }
}

const waitForClickableButtonAndClick = async (
  app: Application,
  selector: string
) => {
  await waitForClickable(app, selector)
  // In addition to waitForClickable above, buttons must also be enabled.
  await appStep(`wait for button ${selector} to be enabled`, () =>
    retryUntil(
      () => app.client.getAttribute(selectors.pcaps.button, "disabled"),
      (isDisabled) => !isDisabled
    )
  )

  // We can use app.client.click() here because we've done the necessary
  // waiting.
  try {
    await retryUntil(
      () => app.client.click(selector),
      (success) => success
    )
  } catch (e) {
    LOG.debug("trying to execute script for click: " + e)
    await app.client.selectorExecute(selector, (elem) => {
      elem.click()
    })
  }
}

export const clickPcapButton = async (app: Application) => {
  await waitForClickableButtonAndClick(app, selectors.pcaps.button)
}
