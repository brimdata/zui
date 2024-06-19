import {PayloadAction, createSlice} from "@reduxjs/toolkit"
import {LakeAttrs, LakesState} from "./types"

const slice = createSlice({
  name: "$LAKES",
  initialState: {} as LakesState,
  reducers: {
    add: (state, action: PayloadAction<LakeAttrs>) => {
      const lake = action.payload
      state[lake.id] = lake
    },
    remove: (state, action: PayloadAction<string>) => {
      const id = action.payload
      delete state[id]
    },
    update: (
      state,
      action: PayloadAction<{id: string; changes: Partial<LakeAttrs>}>
    ) => {
      const {id, changes} = action.payload
      state[id] = {...state[id], ...changes}
    },
    setAccessToken: (
      state,
      action: PayloadAction<{lakeId: string; accessToken: string}>
    ) => {
      const {lakeId, accessToken} = action.payload
      if (state[lakeId] && state[lakeId].authData) {
        state[lakeId].authData.accessToken = accessToken
      }
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
