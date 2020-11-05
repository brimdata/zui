import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import AppErrorBoundary from "./components/AppErrorBoundary"
import initDetail from "./initializers/initDetail"
import lib from "./lib"
import LogDetailsWindow from "./components/LogDetailsWindow"
import StartupError from "./components/StartupError"
import {Modals} from "./components/Modals"
import {ThemeProvider} from "styled-components"
import theme from "./style-theme"

initDetail()
  .then((store) => {
    ReactDOM.render(
      <AppErrorBoundary dispatch={store.dispatch}>
        <div id="modal-dialog-root" />
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <LogDetailsWindow />
            <Modals />
          </ThemeProvider>
        </Provider>
      </AppErrorBoundary>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })
