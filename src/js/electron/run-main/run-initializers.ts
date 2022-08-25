import log from "electron-log"
import path from "path"
import {BrimMain} from "../brim"
import {requireDir} from "../utils/require-dir"

export async function runInitializers(main: BrimMain) {
  await requireDir({
    dir: path.join(__dirname, "../initializers"),
    exclude: /\.test/,
    run: (src, file) => {
      log.debug("Initializing:", path.basename(file))
      src.initialize(main)
    },
  })
  log.info(`Initializers loaded`)
}
