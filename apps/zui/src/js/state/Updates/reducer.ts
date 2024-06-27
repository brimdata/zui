import {PayloadAction, createSlice} from "@reduxjs/toolkit"

export const slice = createSlice({
  name: "$UPDATES",
  initialState: {
    nextVersion: null as null | string,
    isChecking: false,
    isDownloading: false,
    downloadProgress: null as null | number,
    error: null,
  },
  reducers: {
    reset() {
      return slice.initialState()
    },
    setNextVersion(s, a: PayloadAction<string | null>) {
      s.nextVersion = a.payload
    },
    setIsChecking(s, a: PayloadAction<boolean>) {
      s.isChecking = a.payload
    },
    setDownloadProgress(s, a: PayloadAction<number>) {
      s.downloadProgress = a.payload
    },
    setIsDownloading(s, a: PayloadAction<boolean>) {
      s.isDownloading = a.payload
    },
    setError(s, a: PayloadAction<string>) {
      s.error = a.payload
    },
  },
})
