import {isNumber} from "lodash"

export const isChecking = (state) => state.updates.isChecking
export const getNextVersion = (state) => state.updates.nextVersion
export const getDownloadProgress = (state) => state.updates.downloadProgress
export const isDownloading = (state) => isNumber(state.updates.downloadProgress)
export const getError = (state) => state.updates.error
