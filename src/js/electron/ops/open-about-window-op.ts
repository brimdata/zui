import log from "electron-log"
import {createOperation} from "../operations"

export const openAboutWindowOp = createOperation(
  "openAboutWindow",
  async ({main}) => {
    const about = main.windows.all.find((w) => w.name === "about")
    if (about) {
      about.ref.focus()
    } else {
      try {
        await main.windows.create("about")
      } catch (e) {
        log.error("about window failed to open")
      }
    }
  }
)
