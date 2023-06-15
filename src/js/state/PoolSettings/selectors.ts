import {createSelector} from "@reduxjs/toolkit"
import {State} from "../types"

export function getDefaults() {
  return {
    timeField: "ts",
    colorField: "typeof(this)",
  }
}

export function getEntities(state: State) {
  return state.poolSettings.entities
}

export const find = (state: State, id: string) => {
  return state.poolSettings.entities[id]
}

export const findWithDefaults = createSelector(
  (_: State, id: string) => id,
  getEntities,
  (id, entities) => entities[id] ?? getDefaults()
)
