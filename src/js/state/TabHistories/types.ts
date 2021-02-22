import {EntityState} from "@reduxjs/toolkit"
import {HistoryEntry} from "app/core/models/histories"

export interface SerializedHistory {
  id: string
  index: number
  entries: HistoryEntry[]
}

export type TabHistoriesState = EntityState<SerializedHistory>
