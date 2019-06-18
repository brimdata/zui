/* @flow */

import {retry} from "./control"
import {selectors} from "../../src/js/test/integration"

export const logIn = (app) => {
  return app.client
    .setValue(selectors.login.host, "localhost")
    .setValue(selectors.login.port, "9867")
    .click(selectors.login.button)
}

export const waitForLoginAvailable = (app) => {
  const waitForHostname = () => {
    return app.client.waitForExist(selectors.login.host)
  }
  const waitForPort = () => {
    return app.client.waitForExist(selectors.login.port)
  }
  const waitForButton = () => {
    return app.client.waitForExist(selectors.login.button)
  }
  return waitForHostname()
    .then(() => waitForPort())
    .then(() => waitForButton())
}

export const waitForSearch = (app) => {
  return retry(() => app.client.element("#main-search-input").getValue())
}

export const waitForHistogram = (app) => {
  return retry(() =>
    app.client.element(selectors.histogram.topLevel).getAttribute("class")
  )
}
