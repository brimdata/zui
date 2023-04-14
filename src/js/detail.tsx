import {AppProvider} from "src/app/core/context"
import AppWindowRouter from "src/app/router/app-window-router"
import React from "react"
import {createRoot} from "react-dom/client"
import "regenerator-runtime/runtime"
import Tooltip from "./components/Tooltip"
import LogDetailsWindow from "./components/LogDetailsWindow"
import {Modals} from "./components/Modals"
import lib from "./lib"
import initialize from "./initializers/initialize"

initialize()
  .then(({store, api}) => {
    window.onbeforeunload = () => {
      api.abortables.abortAll()
    }
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(
      <AppProvider store={store} api={api}>
        <AppWindowRouter>
          <div id="modal-dialog-root" />
          <LogDetailsWindow />
          <Modals />
          <Tooltip />
        </AppWindowRouter>
      </AppProvider>
    )
  })
  .catch((e) => {
    console.error(e)
  })
