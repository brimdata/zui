import {Client} from "@brimdata/zealot"
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only"
import {existsSync} from "fs"
import {reject} from "lodash"
import path from "path"
import {
  ElectronApplication,
  Page,
  _electron as electron
} from "playwright-chromium"
import env from "../../../src/app/core/env"
import {itestDir} from "./env"

export default class TestApp {
  brim: ElectronApplication
  zealot: Client
  mainWin: Page
  testNdx = 1
  currentDataDir: string

  constructor(private name: string) {
    this.zealot = new Client("http://localhost:9867")
  }

  async init() {
    const userDataDir = path.resolve(
      path.join(itestDir(), this.name, (this.testNdx++).toString())
    )
    this.currentDataDir = userDataDir

    const {bin, entry} = getAppInfo()
    const launchOpts = {
      args: [`--user-data-dir=${userDataDir}`, entry],
      bypassCSP: true,
      timeout: 60000
    }

    // @ts-ignore
    if (bin) launchOpts.executablePath = bin
    this.brim = await electron.launch(launchOpts)
    await waitForTrue(() => this.brim.windows().length === 2)
    await Promise.all(
      this.brim.windows().map((page) =>
        page.waitForFunction(() => {
          // @ts-ignore
          return global.firstMount
        })
      )
    )
    this.mainWin = await this.getWindowByTitle("Brim")
  }

  async shutdown() {
    await this.brim.close()
  }

  async getWindowByTitle(title: string): Promise<Page> {
    const wins = await this.brim.windows()
    const winTitles = await Promise.all(wins.map((w) => w.title()))
    return wins[winTitles.findIndex((wTitle) => wTitle === title)]
  }
}

const getAppInfo = () => {
  const macInstallPath = "/Applications/Brim.app/Contents/MacOS/Brim"
  const linuxInstallPath = "/usr/bin/brim"
  const packagedEntryPoint = "app.asar/app/dist/js/electron/main.js"

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

  return {bin: null, entry: "../.."}
}

function waitForTrue(check: () => boolean) {
  return new Promise<void>((resolve) => {
    const id = setTimeout(() => reject("Gave up"), 30000)
    const run = () => {
      if (check()) {
        clearTimeout(id)
        resolve()
      } else {
        setTimeout(() => run(), 100)
      }
    }
    run()
  })
}
