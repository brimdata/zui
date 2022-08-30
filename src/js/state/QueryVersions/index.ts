import {isEqual} from "lodash"
import {State} from "../types"
import {versionSlice, reducer} from "./reducer"
import {QueryVersion} from "./types"

export default {
  ...versionSlice,
  raw: (state: State) => state.queryVersions,
  reducer,
  areEqual(a: QueryVersion, b: QueryVersion) {
    return isEqual(a?.pins, b?.pins) && isEqual(a?.value, b?.value)
  },
  initial(): QueryVersion {
    return {
      ts: new Date().toISOString(),
      version: "0",
      value: "",
      pins: [],
    }
  },
}
