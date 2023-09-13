import {createSelector} from "@reduxjs/toolkit"
import {State} from "../types"

export const getFiles = (state: State) => state.loadDataForm.files
export const getShaper = (state: State) => state.loadDataForm.shaper
export const getEditorSize = (state: State) => state.loadDataForm.editorSize
export const getSidebarSize = (state: State) => state.loadDataForm.sidebarSize
export const getFormat = (state: State) => state.loadDataForm.format
export const getResultsRatio = (state: State) => state.loadDataForm.resultsRatio
export const getPoolId = (state: State) => state.loadDataForm.poolId

export const getMainStyle = createSelector(getEditorSize, (editorSize) => {
  return {
    gridTemplateRows: `minmax(100px, ${editorSize}px) minmax(200px, 1fr)`,
  }
})

export const getGridStyle = createSelector(getSidebarSize, (sidebarSize) => {
  return {
    gridTemplateColumns: `minmax(400px, 1fr) minmax(260px, ${sidebarSize}px)`,
  }
})

export const getResultsStyle = createSelector(getResultsRatio, (ratio) => {
  const left = ratio
  const right = 1 - ratio

  return {
    gridTemplateColumns: `${left}fr ${right}fr`,
  }
})
