import {Application} from "spectron"

import {retryUntil} from "../../control"
import {LOG} from "../../log"

import logStep from "../util/logStep"

const waitForClickable = async (app: Application, selector: string) => {
  // In testing, it's been shown than there is no need to scroll to
  // elements to make them be visible, as long as the element's
  // container allows scrolling. However, some Internet searches suggest
  // scrolling to the element before trying to click in order to avoid
  // problems like those described in
  // https://github.com/brimsec/brim/issues/668
  await logStep(`wait for element to exist: "${selector}"`, () =>
    app.client.waitForExist(selector)
  )
  await logStep(`wait for element to be visible: "${selector}"`, () =>
    app.client.waitForVisible(selector)
  )
  return logStep(`scroll to: "${selector}"`, () => app.client.scroll(selector))
}

export const click = (app: Application, selector: string) =>
  logStep(`click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)
    try {
      return retryUntil(
        () => app.client.click(selector),
        (success) => success
      )
    } catch (e) {
      LOG.debug("trying to execute script for click: " + e)
      return app.client.selectorExecute(selector, (elem) => {
        elem.click()
      })
    }
  })

export const rightClick = (app: Application, selector: string) =>
  logStep(`right-click on selector "${selector}"`, async () => {
    await waitForClickable(app, selector)
    try {
      return retryUntil(
        () => app.client.rightClick(selector),
        (success) => success
      )
    } catch (e) {
      LOG.debug("trying to execute script for rightClick: " + e)
      return app.client.selectorExecute(selector, (elem) => {
        elem.rightClick()
      })
    }
  })

export const waitForClickableButtonAndClick = async (
  app: Application,
  selector: string
) => {
  await waitForClickable(app, selector)
  // In addition to waitForClickable above, buttons must also be enabled.
  await logStep(`wait for button ${selector} to be enabled`, () =>
    retryUntil(
      () => app.client.getAttribute(selector, "disabled"),
      (isDisabled) => !isDisabled
    )
  )

  // We can use app.client.click() here because we've done the necessary
  // waiting.
  try {
    return retryUntil(
      () => app.client.click(selector),
      (success) => success
    )
  } catch (e) {
    LOG.debug("trying to execute script for click: " + e)
    return app.client.selectorExecute(selector, (elem) => {
      elem.click()
    })
  }
}
