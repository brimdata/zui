import {capitalize} from "lodash"

export function formatError(e: Error | string) {
  return capitalize(
    e
      .toString()
      .replace("Error: Error invoking remote method 'pools.create': ", "")
  )
}
