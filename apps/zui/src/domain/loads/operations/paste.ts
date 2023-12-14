import {clipboard} from "electron"
import {createOperation} from "src/core/operations"
import path from "path"
import os from "os"
import {writeFileSync} from "fs-extra"
import {sendToFocusedWindow} from "src/core/ipc"

export const paste = createOperation("loads.paste", () => {
  const data = clipboard.readText()
  const file = path.join(os.tmpdir(), "clipboard.txt")
  writeFileSync(file, data)
  sendToFocusedWindow("loads.previewLoadFiles", {files: [file]})
  return file
})
