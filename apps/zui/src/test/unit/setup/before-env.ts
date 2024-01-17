import log from "electron-log"
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {initZedWasm} from "@brimdata/zed-wasm"

log.transports.console.level = "error"

module.exports = async function () {
  globalThis.zedWasm = await initZedWasm(
    require.resolve("@brimdata/zed-wasm/dist/main.wasm")
  )
}
