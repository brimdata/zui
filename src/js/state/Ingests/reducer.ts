import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export type Ingests = {
  progress: number
  warnings: string[]
}

const slice = createSlice({
  name: "$INGESTS",
  initialState: {} as {
    [poolId: string]: Ingests
  },
  reducers: {
    create: (state, action: PayloadAction<string>) => {
      const poolId = action.payload
      state[poolId] = {progress: 0, warnings: []}
    },

    setProgress: (
      state,
      action: PayloadAction<{poolId: string; progress: number}>
    ) => {
      const {poolId, progress} = action.payload
      state[poolId].progress = progress
    },

    addWarning: (
      state,
      action: PayloadAction<{poolId: string; warning: string}>
    ) => {
      const {poolId, warning} = action.payload
      state[poolId].warnings.push(warning)
    },

    remove: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
