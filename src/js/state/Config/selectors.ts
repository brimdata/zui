import ConfigPropValues from "../ConfigPropValues"
import {State} from "../types"

export const getPoolNameDelimeter = (state: State): string => {
  return ConfigPropValues.get("pools", "nameDelimeter")(state)
}

export const getRunOnEnter = (state: State): string => {
  return ConfigPropValues.get("editor", "runQueryOnEnter")(state)
}
