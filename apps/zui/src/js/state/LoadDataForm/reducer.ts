import {PayloadAction, createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "LOAD_DATA_FORM",
  initialState: {
    files: [] as string[],
  },
  reducers: {
    setFiles: (state, action: PayloadAction<string[]>) => {
      state.files = action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
