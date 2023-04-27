import env from "src/app/core/env"
import {createOperation} from "src/core/operations"

export const properties = createOperation("env.properties", () => {
  return env
})
