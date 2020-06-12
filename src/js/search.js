/* @flow */
import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import initialize from "./initializers/initialize"
import lib from "./lib"

initialize().then((store) => {
  ReactDOM.render(
    <AppErrorBoundary dispatch={store.dispatch}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppErrorBoundary>,
    lib.doc.id("app-root")
  )
})
