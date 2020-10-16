import {BrowserWindow, screen} from "electron"
import {Dimens, getWindowDimens} from "./dimens"

const DEFAULT_DIMENS = {
  x: undefined,
  y: undefined,
  width: 1250,
  height: 750
}

export class SearchWindow {
  name = "search"
  id: string
  ref: BrowserWindow
  lastFocused: number

  constructor(
    dimens: Partial<Dimens>,
    query: object | undefined,
    id: string, // to be removed later, we'll generate our own
    screens: Electron.Rectangle[] = screen
      .getAllDisplays()
      .map((s) => s.workArea)
  ) {
    this.id = id
    this.ref = new BrowserWindow({
      ...getWindowDimens(dimens, DEFAULT_DIMENS, screens),
      titleBarStyle: "hidden",
      resizable: true,
      minWidth: 480,
      minHeight: 100,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        experimentalFeatures: true,
        enableRemoteModule: true
      }
    }).on("ready-to-show", () => {
      this.ref.show()
    })
    this.ref.loadFile("search.html", {query: {...query, id: this.id}})
  }

  touchLastFocused() {
    this.lastFocused = new Date().getTime()
  }

  getDimens(): Dimens {
    const [width, height] = this.ref.getSize()
    const [x, y] = this.ref.getPosition()
    return {x, y, width, height}
  }
}
