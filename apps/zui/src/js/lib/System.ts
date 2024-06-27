import {invoke} from "src/core/invoke"

export function showMessageBox(opts: Electron.MessageBoxOptions) {
  if (global.env.isIntegrationTest) {
    return Promise.resolve({response: 0})
    // To do, mock the options and give the test case a way to select some
  } else {
    return invoke("showMessageBoxOp", opts)
  }
}
