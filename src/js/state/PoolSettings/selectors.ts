import {State} from "../types"

export function getEntities(state: State) {
  return state.poolSettings.entities
}

export const get = (state: State, id: string) => {
  return state.poolSettings.entities[id] ?? null
}
