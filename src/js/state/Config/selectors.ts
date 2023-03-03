import ConfigPropValues from "../ConfigPropValues"
import {State} from "../types"

export const getPoolNameDelimiter = (state: State): string => {
  return ConfigPropValues.get("pools", "nameDelimiter")(state)
}

export const getRunOnEnter = (state: State): string => {
  return ConfigPropValues.get("editor", "runQueryOnEnter")(state)
}
