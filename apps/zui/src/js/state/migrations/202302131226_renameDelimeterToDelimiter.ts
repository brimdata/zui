import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function renameDelimeterToDelimiter(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.configPropValues) continue
    if ("pools" in s.configPropValues) {
      if ("nameDelimeter" in s.configPropValues.pools) {
        s.configPropValues.pools.nameDelimiter =
          s.configPropValues.pools.nameDelimeter
        delete s.configPropValues.pools.nameDelimeter
      }
    }
  }
  return state
}
