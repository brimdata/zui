import {PayloadAction, createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "LOAD_DATA_FORM",
  initialState: {
    files: [] as string[],
    shaper:
      "// The data will run through this script before it's loaded into the lake.\n",
  },
  reducers: {
    setFiles: (state, action: PayloadAction<string[]>) => {
      state.files = action.payload
    },
    addFiles: (state, action: PayloadAction<string[]>) => {
      state.files = [...state.files, ...action.payload]
    },
    setShaper: (state, action: PayloadAction<string>) => {
      state.shaper = action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
