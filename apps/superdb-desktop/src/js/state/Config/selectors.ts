import {isString} from "lodash"
import ConfigPropValues from "../ConfigPropValues"
import {State} from "../types"

export const getPoolNameDelimiter = (state: State): string => {
  return ConfigPropValues.get("pools", "nameDelimiter")(state)
}

export const getRunOnEnter = (state: State): boolean => {
  const value = ConfigPropValues.get("editor", "runQueryOnEnter")(state)
  if (isString(value)) {
    return value === "enter"
  } else {
    // This value used to be a boolean
    return value
  }
}
