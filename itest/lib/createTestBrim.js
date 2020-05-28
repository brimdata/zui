/* @flow */
import type {Locator} from "../../src/js/test/createLocator"
import {
  appStep,
  click,
  ingestFile,
  newAppInstance,
  startApp,
  startSearch,
  writeSearch
} from "./app"
import {retryUntil} from "./control"
import lib from "../../src/js/lib"

export default (name: string) => {
  let app
  let testIdx = 0

  beforeAll(async () => {
    app = await newAppInstance(name, ++testIdx)
    await startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) await app.stop()
  })

  return {
    ingest(file: string) {
      return ingestFile(app, file)
    },

    mockSaveDialog(value: {canceled: boolean, filePath: ?string}) {
      return app.mainProcess.emit(
        "spectron:mock",
        "windows:showSaveDialog",
        value
      )
    },

    setValue(locator: Locator, value: string) {
      return appStep(`set input ${locator.css} to ${value}`, () =>
        app.client
          .waitForVisible(locator.css)
          .then(() => app.client.setValue(locator.css, value))
      )
    },

    getText(locator: Locator) {
      return appStep(`get text from ${locator.css}`, async () => {
        await app.client.waitForVisible(locator.css)
        return await app.client.getText(locator.css)
      })
    },

    clickAppMenuItem(id: string) {
      return app.mainProcess.emit("spectron:clickAppMenuItem", id)
    },

    search(input: string) {
      return writeSearch(app, input).then(() => startSearch(app))
    },

    click(locator: Locator) {
      return click(app, locator.css)
    },

    waitForText(locator: string, regex: RegExp) {
      return retryUntil(
        () => app.client.getText(locator),
        (s) => regex.test(s)
      )
    },

    waitUntil(fn: () => boolean, opts?: Object) {
      return app.client.waitUntil(fn, opts)
    },

    isVisible(locator: Locator) {
      return app.client.isVisible(locator.css)
    },

    isNotVisible(locator: Locator) {
      return app.client.isVisible(locator.css).then((v) => !v)
    },

    wait(ms: number) {
      return lib.sleep(ms)
    }
  }
}
