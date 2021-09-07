import {BrimProvider} from "app/core/context"
import AppWindowRouter from "app/router/app-window-router"
import React from "react"
import ReactDOM from "react-dom"
import "regenerator-runtime/runtime"
import BrimTooltip from "./components/BrimTooltip"
import LogDetailsWindow from "./components/LogDetailsWindow"
import {Modals} from "./components/Modals"
import StartupError from "./components/StartupError"
import initDetail from "./initializers/initDetail"
import lib from "./lib"

initDetail()
  .then(({store, api, pluginManager}) => {
    window.onbeforeunload = () => {
      api.abortables.abort()
      pluginManager.deactivate()
    }
    ReactDOM.render(
      <BrimProvider store={store} api={api}>
        <AppWindowRouter>
          <div id="modal-dialog-root" />
          <LogDetailsWindow />
          <Modals />
          <BrimTooltip />
        </AppWindowRouter>
      </BrimProvider>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })
