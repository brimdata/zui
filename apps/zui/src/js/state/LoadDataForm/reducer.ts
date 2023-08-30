import {LoadFormat} from "@brimdata/zed-js"
import {PayloadAction, createSlice} from "@reduxjs/toolkit"
import {bounded} from "src/util/bounded"

const slice = createSlice({
  name: "LOAD_DATA_FORM",
  initialState: {
    format: "auto" as LoadFormat,
    files: [] as string[],
    shaper: "// Transform the data here before loading it.\n",
    editorSize: 100,
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
    setEditorSize: (state, action: PayloadAction<number>) => {
      state.editorSize = bounded(action.payload, [20, Infinity])
    },
    setFormat: (state, action: PayloadAction<LoadFormat>) => {
      state.format = action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
