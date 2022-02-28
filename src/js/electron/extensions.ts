import env from "src/app/core/env"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer"

import log from "electron-log"

export function installExtensions() {
  if (env.isIntegrationTest) return
  // @ts-ignore The types package is not up to date
  return installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
    loadExtensionOptions: {allowFileAccess: true}
  })
    .then(() => log.info("Devtools loaded"))
    .catch((err) => log.error("Devtools error occurred: ", err))
}
