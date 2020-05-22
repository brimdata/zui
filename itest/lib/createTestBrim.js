/* @flow */
import {
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

    writeSearch(input: string) {
      return writeSearch(app, input)
    },

    startSearch() {
      return startSearch(app)
    },

    click(locator: string) {
      return click(app, locator)
    },

    waitForText(locator: string, regex: RegExp) {
      return retryUntil(
        () => app.client.getText(locator),
        (s) => regex.test(s)
      )
    },

    wait(ms: number) {
      return lib.sleep(ms)
    }
  }
}
