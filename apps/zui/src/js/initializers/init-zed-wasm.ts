// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {initZedWasm} from "@brimdata/zed-wasm/dist/browser.js"

export async function initializeZedWasm() {
  if (!globalThis.zedWasm) {
    const resp = fetch(
      "app-asset://node_modules/@brimdata/zed-wasm/dist/main.wasm"
    )
    globalThis.zedWasm = await initZedWasm(resp)
  }
}
