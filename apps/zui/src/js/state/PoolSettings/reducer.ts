import {createEntityAdapter} from "@reduxjs/toolkit"
import {PoolSetting} from "./types"
import {createCrudSlice} from "src/modules/every-reducer/create-crud-slice"

const adapter = createEntityAdapter<PoolSetting>()
const slice = createCrudSlice<PoolSetting>({name: "$POOL_SETTINGS", adapter})

export const reducer = slice.reducer
export const actions = slice.actions
