import * as operations from "./operations"

export type UpdatesOperations = {
  "updates.open": typeof operations.open
  "updates.check": typeof operations.check
  "updates.downloadAndInstall": typeof operations.downloadAndInstall
}
