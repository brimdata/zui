import {State} from "../types"

export const isChecking = (state: State) => state.updates.isChecking
export const getNextVersion = (state: State) => state.updates.nextVersion
export const getDownloadProgress = (state: State) =>
  state.updates.downloadProgress
export const isDownloading = (state: State) => state.updates.isDownloading
export const getError = (state: State) => state.updates.error
