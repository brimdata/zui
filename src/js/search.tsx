import {AppProvider} from "src/app/core/context"
import "regenerator-runtime/runtime"
import App from "./components/App"
import StartupError from "./components/StartupError"
import initialize from "./initializers/initialize"
import lib from "./lib"
import {getPersistedWindowState} from "./state/stores/get-persistable"
import TabHistories from "./state/TabHistories"
import React from "react"
import {createRoot} from "react-dom/client"
import {autosave} from "./electron/ops"

initialize()
  .then(({store, api}) => {
    window.onbeforeunload = () => {
      api.abortables.abortAll()
      store.dispatch(TabHistories.save(global.tabHistories.serialize()))
      autosave(global.windowId, getPersistedWindowState(store.getState()))
    }
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(
      <AppProvider store={store} api={api}>
        <App />
      </AppProvider>
    )
  })
  .catch((e) => {
    console.error(e)
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(<StartupError error={e} />)
  })
