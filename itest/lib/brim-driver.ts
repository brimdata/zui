import {Application} from "spectron"
import lib from "src/js/lib"
import {Locator} from "src/js/test/createLocator"
import {htmlContextMenu} from "src/js/test/locators"
import {isString} from "zealot/util/utils"
import {click, rightClick} from "./appStep/api/click"
import ingestFile from "./appStep/api/ingestFile"
import search, {getResults} from "./appStep/api/search"
import takeScreenshot from "./appStep/api/takeScreenshot"
import waitForHook from "./appStep/api/waitForHook"
import logStep from "./appStep/util/logStep"
import {retryUntil} from "./control"

export default class BrimDriver {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  $(locator: Locator | string): WebdriverIO.Element {
    if (isString(locator)) return this.app.client.$(locator)
    else return this.app.client.$(locator.css)
  }

  find(selector: string): WebdriverIO.Element {
    return this.app.client.$(selector)
  }

  findAll(selector: string): WebdriverIO.ElementArray {
    return this.app.client.$$(selector)
  }

  hook(name, opts?) {
    return waitForHook(this.app, name, opts)
  }

  navTo(path: string) {
    // @ts-ignore
    return this.app.client.execute((path) => navTo(path), path)
  }

  getApp() {
    return this.app
  }

  ingest(file: string) {
    return ingestFile(this.app, file)
  }

  mockSaveDialog(value: {
    canceled: boolean
    filePath: string | null | undefined
  }) {
    return this.app.mainProcess.emit(
      // @ts-ignore
      "spectron:mock",
      "windows:showSaveDialog",
      value
    )
  }

  setValue(locator: Locator, value: string) {
    return logStep(`set input ${locator.css} to ${value}`, async () => {
      const el = await this.app.client.$(locator.css)
      await el.waitForDisplayed()
      return el.setValue(value)
    })
  }

  getText(locator: Locator) {
    return logStep(`get text from ${locator.css}`, async () => {
      const el = await this.app.client.$(locator.css)
      await el.waitForDisplayed()
      return el.getText()
    })
  }

  takeScreenshot() {
    return takeScreenshot(this.app)
  }

  clickAppMenuItem(id: string) {
    // @ts-ignore
    return this.app.mainProcess.emit("spectron:clickAppMenuItem", id)
  }

  async clickContextMenuItem(text: string) {
    const menu = await this.$(htmlContextMenu)
    const item = await menu.$(`li=${text}`)
    return item.click()
  }

  search(input: string) {
    return search(this.app, input)
  }

  click(locator: Locator | string | WebdriverIO.Element) {
    if (isString(locator)) {
      return click(this.app, locator)
    } else if ("css" in locator) {
      return click(this.app, locator.css)
    } else {
      return locator.click({button: "left"})
    }
  }

  rightClick(locator: Locator | string | WebdriverIO.Element) {
    if (isString(locator)) {
      return rightClick(this.app, locator)
    } else if ("css" in locator) {
      return rightClick(this.app, locator.css)
    } else {
      return locator.click({button: "right"})
    }
  }

  hasText(input: string | RegExp, locator: Locator | string = "body") {
    return retryUntil(
      () =>
        this.app.client
          .$(typeof locator === "string" ? locator : locator.css)
          .then((el) => el.getText()),
      (s) => (typeof input === "string" ? s.includes(input) : input.test(s))
    )
  }

  // waitForHTMLText will seek out html instead of visible text, use for hidden elements
  waitForHTMLText(locator: string, regex: RegExp) {
    return retryUntil(
      async () => (await this.app.client.$(locator)).getHTML(false),
      (s) => regex.test(s)
    )
  }

  async isVisible(locator: Locator) {
    return !!(await (await this.app.client.$(locator.css)).isDisplayed())
  }

  async isNotVisible(locator: Locator) {
    return !(await (await this.app.client.$(locator.css)).isDisplayed())
  }

  wait(ms: number) {
    return lib.sleep(ms)
  }

  viewerResults(opts: {headers: boolean} = {headers: true}) {
    return getResults(this.app, opts.headers)
  }
}
