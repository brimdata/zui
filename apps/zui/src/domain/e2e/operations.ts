import env from "src/app/core/env"
import {createOperation} from "src/core/operations"

export const getFilePaths = createOperation("e2e.getFilePaths", () => {
  if (!env.isTest) {
    throw new Error("e2e operation called from non-test environment")
  }

  if (!global.e2eFilePaths) {
    throw new Error(
      "expected an array of strings to be set in e2eFilePaths global"
    )
  }

  return global.e2eFilePaths
})
