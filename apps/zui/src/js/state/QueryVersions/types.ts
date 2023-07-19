import {EntityState} from "@reduxjs/toolkit"
import {QueryPin} from "../Editor/types"

export type VersionsState = EntityState<QueryVersion>
export type QueryVersionsState = {
  [queryId: string]: VersionsState
}

export type QueryVersion = {
  version: string
  ts: string
  value: string
  pins: QueryPin[]
}
