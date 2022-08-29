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
  pins?: QueryPin[]
}

// function select(state: Object, id: string) {
//   return state[id]
// }
// type SelectType = typeof select

// function createNestedParts<T extends Function>() {
//   return {
//     at(...args: ParamsAfterState<T>) {},
//   }
// }

// function configure(fn) {
//   const at = createNestedParts(fn)
//   return {at}
// }

// const obj = configure(select)
// obj.at("hi")

// function at(...args: ParamsAfterState<SelectType>) {}

// at("1")
