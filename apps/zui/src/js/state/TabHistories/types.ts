import {EntityState} from "@reduxjs/toolkit"
export interface SerializedHistory {
  id: string
  index: number
  entries: string[]
}

export type TabHistoriesState = EntityState<SerializedHistory>
