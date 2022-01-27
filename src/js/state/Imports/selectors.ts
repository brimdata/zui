import {State} from "../types"

export const get = (poolId: string) => (state: State) => state.imports[poolId]

export const isInProgress = (poolId: string) => (state: State) => {
  const i = state.imports[poolId]
  return i && i.progress < 1
}
