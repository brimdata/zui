import {configureStore} from "@reduxjs/toolkit"
import globalReducer, {GlobalState} from "./globalReducer"

export default function(initState: GlobalState | undefined) {
  return configureStore({
    reducer: globalReducer,
    preloadedState: initState,
    middleware: (m) =>
      m({
        serializableCheck: false,
        immutableCheck: false
      })
  })
}
