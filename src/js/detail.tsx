import {BrimProvider} from "src/app/core/context"
import AppWindowRouter from "src/app/router/app-window-router"
import React from "react"
import {createRoot} from "react-dom/client"
import "regenerator-runtime/runtime"
import BrimTooltip from "./components/BrimTooltip"
import LogDetailsWindow from "./components/LogDetailsWindow"
import {Modals} from "./components/Modals"
import {initDetail} from "./initializers/initDetail"
import lib from "./lib"

initDetail()
  .then(({store, api, pluginManager}) => {
    window.onbeforeunload = () => {
      api.abortables.abortAll()
      pluginManager.deactivate()
    }
    const container = lib.doc.id("app-root")
    const root = createRoot(container!)
    root.render(
      <BrimProvider store={store} api={api}>
        <AppWindowRouter>
          <div id="modal-dialog-root" />
          <LogDetailsWindow />
          <Modals />
          <BrimTooltip />
        </AppWindowRouter>
      </BrimProvider>
    )
  })
  .catch((e) => {
    console.error(e)
  })
