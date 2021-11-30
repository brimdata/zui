import {_electron as electron, ElectronApplication, Page} from "playwright"
import {selectors} from "../../integration/helpers/integration"
import {selectorWithText} from "./helpers"
import {hookLogLocator, submitButton} from "../../integration/helpers/locators"
import path from "path"
import {itestDir} from "./env"
import env from "../../../app/core/env"
import {existsSync} from "fs"
import {createZealot, Zealot} from "../../../zealot-old"

export default class TestApp {
  brim: ElectronApplication
  zealot: Zealot
  mainWin: Page
  testNdx = 1
  currentDataDir: string

  constructor(private name: string) {
    this.zealot = createZealot("http://localhost:9867")
  }

  async init() {
    const userDataDir = path.resolve(
      path.join(itestDir(), this.name, (this.testNdx++).toString())
    )
    this.currentDataDir = userDataDir
    this.brim = await electron.launch({
      args: [`--user-data-dir=${userDataDir}`, getAppBinPath()]
    })
    // wait for main window to render
    await this.brim.firstWindow()
    // wait for hidden window to render
    await new Promise((res) => {
      this.brim.waitForEvent("window").then(res)
    })
    this.mainWin = await this.getWindowByTitle("Brim")
    // NOTE: hack, fixes issue where on Windows the app's windows sometimes don't load properly
    await this.mainWin.reload()
    await (await this.getWindowByTitle("Hidden Window")).reload()
  }

  async shutdown() {
    await this.brim.close()
  }

  async withRetry(cb: () => Promise<any>, retries = 5, delay = 400) {
    for (let i = 0; i < retries; i++) {
      const res = await cb()
      if (!res) {
        if (i < retries - 1) await new Promise((res) => setTimeout(res, delay))
        continue
      }
      return res
    }
  }

  async getWindowByTitle(title: string): Promise<Page> {
    const wins = await this.brim.windows()
    const winTitles = await Promise.all(wins.map((w) => w.title()))
    return wins[winTitles.findIndex((wTitle) => wTitle === title)]
  }

  async ingestFiles(filepaths: string[]): Promise<void> {
    await this.mainWin.click(".add-tab", {timeout: 60000})
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
