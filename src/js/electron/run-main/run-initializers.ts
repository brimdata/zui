import log from "electron-log"
import path from "path"
import {BrimMain} from "../brim"
import {requireDir} from "../utils/require-dir"

export async function runInitializers(main: BrimMain) {
  const count = await requireDir({
    dir: path.join(__dirname, "../initializers"),
    exclude: /\.test/,
    run: (src) => src.initialize(main),
  })
  log.info(`Loaded ${count} initializers`)
}
