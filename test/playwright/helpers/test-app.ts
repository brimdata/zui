import {
  _electron as electron,
  ElectronApplication,
  Page,
  BrowserContext
} from "playwright-chromium"
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
  currentCtx: BrowserContext

  constructor(private name: string) {
    this.zealot = createZealot("http://localhost:9867")
  }

  async init() {
    const userDataDir = path.resolve(
      path.join(itestDir(), this.name, (this.testNdx++).toString())
    )
    this.currentDataDir = userDataDir

    const {bin, entry} = getAppInfo()
    const launchOpts = {
      args: [`--user-data-dir=${userDataDir}`, entry]
    }

    // @ts-ignore
    if (bin) launchOpts.executablePath = bin
    this.brim = await electron.launch(launchOpts)
    // wait for main window to render
    await this.brim.firstWindow()
    // wait for second window ('Hidden Window') to render
    await new Promise((res) => {
      this.brim.waitForEvent("window").then(res)
    })
    this.mainWin = await this.getWindowByTitle("Brim")
    this.mainWin.setDefaultTimeout(60000)

    this.currentCtx = this.brim.context()
    this.currentCtx.tracing.start({screenshots: true, snapshots: true})

    // NOTE: reload and wait hack, fixes issue where on Windows the app's windows sometimes don't initially load properly
    await Promise.all([
      this.mainWin.reload(),
      this.mainWin.waitForNavigation({waitUntil: "load"}),
      this.mainWin.waitForNavigation({waitUntil: "networkidle"})
    ])
  }

  async shutdown() {
    await this.currentCtx.tracing.stop({
      path: path.join(this.currentDataDir, "trace.zip")
    })
    await this.brim.close()
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

const getAppInfo = () => {
  const macInstallPath = "/Applications/Brim.app/Contents/MacOS/Brim"
  const linuxInstallPath = "/usr/bin/brim"
  const packagedEntryPoint = "app.asar/app/dist/src/js/electron/main.js"

  if (env.isCI && env.isMac && existsSync(macInstallPath)) {
    return {
      bin: macInstallPath,
      entry: path.join(macInstallPath, "Contents/Resources", packagedEntryPoint)
    }
  }
  if (env.isCI && env.isLinux && existsSync(linuxInstallPath)) {
    return {
      bin: linuxInstallPath,
      entry: path.join(linuxInstallPath, "resources", packagedEntryPoint)
    }
  }

  return {bin: null, entry: "."}
}
