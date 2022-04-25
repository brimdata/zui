import {configureStore} from "@reduxjs/toolkit"
import globalReducer, {GlobalState} from "./globalReducer"

export default function (initState: GlobalState | undefined) {
  return configureStore({
    reducer: globalReducer,
    preloadedState: initState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        thunk: true,
        immutableCheck: false,
        serializableCheck: false,
      })
    },
  })
}
