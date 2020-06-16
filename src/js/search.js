/* @flow */
import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import GlobalContext from "./state/GlobalContext"
import initializers from "./initializers/initSearch"
import lib from "./lib"
import theme from "./style-theme"
import {ThemeProvider} from "styled-components"

initializers().then(({globalStore, store}) => {
  ReactDOM.render(
    <AppErrorBoundary dispatch={store.dispatch}>
      <Provider store={globalStore} context={GlobalContext}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </Provider>
    </AppErrorBoundary>,
    lib.doc.id("app-root")
  )
})
