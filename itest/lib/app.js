/* @flow */

import {retry} from "./control"
import {selectors} from "../../src/js/test/integration"
import {Application} from "spectron"
import {LOG} from "./log"

const appStep = async (stepMessage, f) => {
  LOG.debug(`Starting step "${stepMessage}"`)
  let result = await f()
  LOG.debug(`Finished step "${stepMessage}"`)
  return result
}

export const logIn = (app: Application) => {
  return appStep("fill out login page and log in", () =>
    app.client
      .setValue(selectors.login.host, "localhost")
      .setValue(selectors.login.port, "9867")
      .click(selectors.login.button)
  )
}

export const waitForLoginAvailable = (app: Application) => {
  const waitForHostname = () => {
    return app.client.waitForExist(selectors.login.host)
  }
  const waitForPort = () => {
    return app.client.waitForExist(selectors.login.port)
  }
  const waitForButton = () => {
    return app.client.waitForExist(selectors.login.button)
  }
  return appStep("wait for hostname, port, and login widget", () =>
    waitForHostname()
      .then(() => waitForPort())
      .then(() => waitForButton())
  )
}

export const waitForSearch = (app: Application) => {
  return appStep("wait for main search input to appear", () =>
    retry(() => app.client.element("#main-search-input").getValue())
  )
}

export const waitForHistogram = (app: Application) => {
  return appStep("wait for base histogram element hierarchy", () =>
    retry(() =>
      app.client.element(selectors.histogram.topLevel).getAttribute("class")
    )
  )
}

export const writeSearch = (app: Application, searchText: string) =>
  appStep("write to main search", () =>
    app.client.setValue(selectors.search.input, searchText)
  )

export const getSearchText = (app: Application) =>
  appStep("get contents of main search", () =>
    app.client.getValue(selectors.search.input)
  )

export const startSearch = (app: Application) =>
  appStep("click the search button", () =>
    app.client.click(selectors.search.button)
  )

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
      retry(() => app.client.getHTML(selectors.viewer.headers))
    ).then((headers) => {
      if (typeof headers === "string") {
        headers = [headers]
      }
      return headers.map((h) => _trim(h))
    })
  }
  const searchResults = () =>
    appStep("get search tuples", () =>
      app.client.getText(selectors.viewer.results)
    )

  let headers = await headerResults()
  let search = await searchResults()
  // $FlowFixMe
  return headers.concat(search)
}

export const getCurrentSpace = (app: Application) =>
  appStep("get the current space", () =>
    app.client.getText(selectors.spaces.button)
  )

const getSearchStat = (app: Application, selector: string) =>
  appStep(`get search stats for selector "${selector}"`, () =>
    app.client.getText(selector).then((text) => parseFloat(text.split(" ")[0]))
  )

export const getSearchSpeed = (app: Application) =>
  getSearchStat(app, selectors.search.speed)

export const getSearchTime = (app: Application) =>
  getSearchStat(app, selectors.search.time)

export const setSpan = (app: Application, span: string) => {
  const clickSpanButton = () =>
    appStep("click span selector", () =>
      app.client.click(selectors.span.button)
    )

  const clickSpan = () =>
    appStep(`select span ${span}`, () =>
      app.client.click(selectors.span.menuItem(span))
    )

  return clickSpanButton().then(() => clickSpan())
}
