import {ZuiMain} from "../zui-main"
import {Operation} from "../../core/operations"
import log from "electron-log"
import * as domainOperations from "src/domain/operations"
import * as legacyOperations from "src/electron/ops"

const setup = (main: ZuiMain, exports: Record<string, any>) => {
  for (const namespace in exports) {
    const file = exports[namespace]
    for (let name in file) {
      const op = file[name]
      if (op instanceof Operation) {
        op.listen(main)
      }
    }
  }
}

export function runOperations(main: ZuiMain) {
  setup(main, domainOperations)
  setup(main, legacyOperations)
  log.info(`operations loaded`)
}
