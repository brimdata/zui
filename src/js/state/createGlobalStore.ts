import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
import {State} from "./types"

export default function (initState: Partial<State> | undefined) {
  return configureStore({
    reducer: rootReducer,
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
