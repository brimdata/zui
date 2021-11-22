import {_electron as electron, ElectronApplication, Page} from "playwright"
import {selectors} from "../../integration/helpers/integration"
import {selectorWithText} from "./helpers"
import {hookLogLocator, submitButton} from "../../integration/helpers/locators"
import {createZealot, Zealot} from "../../../zealot"
import path from "path"
import {itestDir} from "./env"
import env from "../../../app/core/env"
import {existsSync} from "fs"

export default class TestApp {
  brim: ElectronApplication
  zealot: Zealot
  mainWin: Page
  testNdx = 1

  constructor(private name: string) {
    this.zealot = createZealot("http://localhost:9867")
  }

  async init() {
    const userDataDir = path.resolve(
      path.join(itestDir(), this.name, (this.testNdx++).toString())
    )
    this.brim = await electron.launch({
      args: [`--user-data-dir=${userDataDir}`, getAppBinPath()]
    })
    await this.brim.firstWindow()

    this.mainWin = await this.getWindowByTitle("Brim")
  }

  async shutdown() {
    await this.brim.close()
  }

  async getWindowByTitle(title: string): Promise<Page> {
    const wins = await this.brim.windows()
    return wins.find(async (w) => {
      return (await w.title()) === title
    })
  }

  async ingestFiles(filepaths: string[]): Promise<void> {
    await this.mainWin.click(".add-tab")
    const [chooser] = await Promise.all([
      this.mainWin.waitForEvent("filechooser"),
      this.mainWin.click(selectors.ingest.filesButton)
    ])

    await chooser.setFiles(filepaths)
    await this.mainWin.waitForSelector(
      selectorWithText(hookLogLocator.css, "import-complete")
    )
  }

  async search(query: string): Promise<void> {
    await this.mainWin.fill(selectors.search.input, query)
    await this.mainWin.click(submitButton.css)
    await this.mainWin.waitForSelector(selectors.viewer.results_base)
  }

  async getViewerResults(includeHeaders = true): Promise<string[]> {
    const viewer = await this.mainWin.$(".viewer")
    let results = await viewer.$$eval<string[], HTMLElement>(
      ".field-cell",
      (fieldCells) => fieldCells.map((fc) => fc.innerText.trim())
    )
    if (includeHeaders) {
      const headers = await viewer.$$eval<string[], HTMLElement>(
        ".header-cell",
        (headerCells) => headerCells.map((hc) => hc.innerText.trim())
      )
      results = headers.concat(results)
    }

    return results
  }
}

const getAppBinPath = () => {
  const macInstallPath = "/Applications/Brim.app/Contents/MacOS/Brim"
  const linuxInstallPath = "/usr/bin/brim"

  if (env.isCI && env.isMac && existsSync(macInstallPath)) {
    return macInstallPath
  }
  if (env.isCI && env.isLinux && existsSync(linuxInstallPath)) {
    return linuxInstallPath
  }

  return "."
}
