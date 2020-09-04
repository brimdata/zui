
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

import log from "electron-log";

export function installExtensions() {
  if (process.env.BRIM_ITEST === "true") return;
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]).then(() => log.info("Devtools loaded")).catch(err => log.error("Devtools error occurred: ", err));
}