/* @flow */
import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import GlobalContext from "./state/GlobalContext"
import initializers from "./initializers"
import lib from "./lib"

initializers().then(({globalStore, store}) => {
  ReactDOM.render(
    <AppErrorBoundary dispatch={store.dispatch}>
      <Provider store={globalStore} context={GlobalContext}>
        <Provider store={store}>
          <App />
        </Provider>
      </Provider>
    </AppErrorBoundary>,
    lib.doc.id("app-root")
  )
})
