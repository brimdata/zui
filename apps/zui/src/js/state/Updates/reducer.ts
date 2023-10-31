import {PayloadAction, createSlice} from "@reduxjs/toolkit"

export const slice = createSlice({
  name: "$UPDATES",
  initialState: {
    nextVersion: null as null | string,
    isChecking: false,
    downloadProgress: null as null | number,
    error: null,
  },
  reducers: {
    setNextVersion(s, a: PayloadAction<string | null>) {
      s.nextVersion = a.payload
    },
    setIsChecking(s, a: PayloadAction<boolean>) {
      s.isChecking = a.payload
    },
    setDownloadProgress(s, a: PayloadAction<number>) {
      s.downloadProgress = a.payload
    },
    setError(s, a: PayloadAction<string>) {
      s.error = a.payload
    },
  },
})
