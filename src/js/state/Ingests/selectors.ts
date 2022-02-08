import {isNumber} from "lodash"
import {State} from "../types"

export const get = (poolId: string) => (state: State) => state.ingests[poolId]

export const isInProgress = (poolId: string) => (state: State) => {
  const i = state.ingests[poolId]
  return !!i && isNumber(i.progress)
}
