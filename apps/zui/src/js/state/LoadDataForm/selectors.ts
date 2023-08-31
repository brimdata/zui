import {createSelector} from "@reduxjs/toolkit"
import {State} from "../types"

export const getFiles = (state: State) => state.loadDataForm.files
export const getShaper = (state: State) => state.loadDataForm.shaper
export const getEditorSize = (state: State) => state.loadDataForm.editorSize
export const getFormat = (state: State) => state.loadDataForm.format

export const getMainStyle = createSelector(getEditorSize, (editorSize) => {
  return {
    gridTemplateRows: `44px minmax(100px, ${editorSize}px) minmax(200px, 1fr)`,
  }
})
