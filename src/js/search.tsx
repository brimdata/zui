import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import {ThemeProvider} from "styled-components"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import StartupError from "./components/StartupError"
import initialize from "./initializers/initialize"
import lib from "./lib"
import theme from "./style-theme"
import deletePartialSpaces from "./flows/deletePartialSpaces"
import TabHistories from "./state/TabHistories"

initialize()
  .then((store) => {
    window.onbeforeunload = () => {
      // This runs during reload
      // Visit initIpcListeners.ts#prepareClose for closing window
      store.dispatch(TabHistories.save(global.tabHistories.serialize()))
      store.dispatch(deletePartialSpaces())
    }
    ReactDOM.render(
      <AppErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </AppErrorBoundary>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    console.error(e)
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })
