import {createEntityAdapter} from "@reduxjs/toolkit"
import {createCrudSlice} from "src/core/state/create-crud-slice"

type PoolSettings = {
  id: string
  timeField?: string
  colorField?: string
  colorMap?: Record<string, string>
}

const adapter = createEntityAdapter<PoolSettings>()
const slice = createCrudSlice<PoolSettings>({name: "$POOL_SETTINGS", adapter})

export const reducer = slice.reducer
export const actions = slice.actions
