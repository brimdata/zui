/* @flow */
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer"

import log from "electron-log"

export function installExtensions() {
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    .then(() => log.info("Devtools loaded"))
    .catch((err) => log.error("An error occurred: ", err))
}
