import {EntityState} from "@reduxjs/toolkit"
import {LocationDescriptorObject} from "history"
export interface SerializedHistory {
  id: string
  index: number
  entries: LocationDescriptorObject[]
}

export type TabHistoriesState = EntityState<SerializedHistory>
