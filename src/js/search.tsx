import {BrimProvider} from "app/core/context"
import {ipcRenderer} from "electron"
import React from "react"
import ReactDOM from "react-dom"
import "regenerator-runtime/runtime"
import App from "./components/App"
import StartupError from "./components/StartupError"
import deletePartialPools from "./flows/deletePartialPools"
import initialize from "./initializers/initialize"
import lib from "./lib"
import {getWindowPersistable} from "./state/getPersistable"
import TabHistories from "./state/TabHistories"

initialize()
  .then(({store, api, pluginManager}) => {
    window.onbeforeunload = () => {
      // This runs during reload
      // Visit initIpcListeners.ts#prepareClose for closing window
      api.abortables.abort()
      pluginManager.deactivate()
      store.dispatch(deletePartialPools())
      store.dispatch(TabHistories.save(global.tabHistories.serialize()))
      ipcRenderer.send(
        "windows:updateState",
        global.windowId,
        getWindowPersistable(store.getState())
      )
    }
    ReactDOM.render(
      <BrimProvider store={store} api={api}>
        <App />
      </BrimProvider>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    console.error(e)
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })
