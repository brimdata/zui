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
import {initConnectionStatuses} from "./initializers/initConnectionStatuses"

initialize()
  .then((store) => {
    initConnectionStatuses(store)
    window.onbeforeunload = () => {
      store.dispatch(deletePartialSpaces())
    }
    ReactDOM.render(
      <AppErrorBoundary dispatch={store.dispatch}>
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
    ReactDOM.render(<StartupError error={e} />, lib.doc.id("app-root"))
  })
