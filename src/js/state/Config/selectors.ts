import ConfigPropValues from "../ConfigPropValues"
import {State} from "../types"

export const getPoolNameDelimeter = (state: State): string => {
  return ConfigPropValues.get("pools", "nameDelimeter")(state)
}
