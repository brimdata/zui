import env from "src/app/core/env"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-assembler"

import log from "electron-log"

export function installExtensions() {
  if (env.isIntegrationTest) return
  // @ts-ignore The types package is not up to date
  return installExtension([REACT_DEVELOPER_TOOLS])
    .then(() => log.info("devtools loaded"))
    .catch((err) => log.error("devtools error occurred: ", err))
}
