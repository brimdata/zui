import {BrimProvider} from "src/app/core/context"
import "regenerator-runtime/runtime"
import App from "./components/App"
import StartupError from "./components/StartupError"
import deletePartialPools from "./flows/deletePartialPools"
import initialize from "./initializers/initialize"
import lib from "./lib"
import {getPersistedWindowState} from "./state/stores/get-persistable"
import TabHistories from "./state/TabHistories"
import React from "react"
import {createRoot} from "react-dom/client"
import {autosaveOp} from "./electron/ops/autosave-op"

initialize()
  .then(({store, api, pluginManager}) => {
    window.onbeforeunload = () => {
      // This runs during reload
      // Visit initIpcListeners.ts#prepareClose for closing window
      api.abortables.abortAll()
      pluginManager.deactivate()
      store.dispatch(deletePartialPools())
      store.dispatch(TabHistories.save(global.tabHistories.serialize()))
      autosaveOp.invoke(
        global.windowId,
        getPersistedWindowState(store.getState())
      )
    }
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(
      <BrimProvider store={store} api={api}>
        <App />
      </BrimProvider>
    )
  })
  .catch((e) => {
    console.error(e)
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(<StartupError error={e} />)
  })
