import {app, clipboard} from "electron"
import {createOperation} from "src/core/operations"
import os from "os"
import * as zui from "src/zui"
import {sendToFocusedWindow} from "src/core/ipc"
import {TempFileHolder} from "../temp-file-holder"
import {join} from "path"

const pasteDirPrefix = join(app.getPath("temp"), "zui_pastes_")
const pastes = new TempFileHolder(pasteDirPrefix)

function removeFiles(loadFiles: string[]) {
  for (let file of loadFiles) if (pastes.has(file)) pastes.removeFile(file)
}

zui.loads.on("error", (load) => removeFiles(load.files))
zui.loads.on("abort", (load) => removeFiles(load.files))
zui.loads.on("success", (load) => removeFiles(load.files))
zui.app.on("quit", () => pastes.destroy())

export const paste = createOperation("loads.paste", () => {
  const data = clipboard.readText()
  const file = pastes.createFile("paste", data)
  sendToFocusedWindow("loads.previewLoadFiles", {files: [file]})
  return file
})
