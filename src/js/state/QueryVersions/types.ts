import {QueryPin} from "../Editor/types"
import {versionSlice} from "./reducer"

export type VersionsState = ReturnType<typeof versionSlice.reducer>
export type QueryVersionsState = {
  [queryId: string]: VersionsState
}

export type QueryVersion = {
  version: string
  ts: Date
  value: string
  pins?: QueryPin[]
}
