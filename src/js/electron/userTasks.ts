import electronIsDev from "./isDev"
import path from "path"

export default function(app: any) {
  if (app.setUserTasks) {
    app.setUserTasks([
      {
        program: process.execPath,
        arguments: getArguments("--new-window"),
        iconPath: process.execPath,
        iconIndex: 0,
        title: "New Window",
        description: "Create a new window"
      },
      {
        program: process.execPath,
        arguments: getArguments("--move-to-current-display"),
        iconPath: process.execPath,
        iconIndex: 0,
        title: "Move Brim to Current Display",
        description: "Move brim windows to the current display."
      }
    ])
  }
}

function getArguments(arg) {
  if (electronIsDev) {
    const appRoot = path.join(__dirname, "..", "..", "..")
    return [appRoot, arg].join(" ")
  } else {
    return arg
  }
}
