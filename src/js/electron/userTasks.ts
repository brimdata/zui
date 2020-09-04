

import electronIsDev from "./isDev";
import path from "path";

export default function (app: any) {
  if (app.setUserTasks) {
    app.setUserTasks([{
      program: process.execPath,
      arguments: getArguments(),
      iconPath: process.execPath,
      iconIndex: 0,
      title: "New Window",
      description: "Create a new window"
    }]);
  }
}

function getArguments() {
  if (electronIsDev) {
    let appRoot = path.join(__dirname, "..", "..", "..");
    return [appRoot, "--new-window"].join(" ");
  } else {
    return "--new-window";
  }
}