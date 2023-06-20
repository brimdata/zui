import {createEntityAdapter} from "@reduxjs/toolkit"
import {createCrudSlice} from "src/core/state/create-crud-slice"
import {PoolSetting} from "./types"

const adapter = createEntityAdapter<PoolSetting>()
const slice = createCrudSlice<PoolSetting>({name: "$POOL_SETTINGS", adapter})

export const reducer = slice.reducer
export const actions = slice.actions
