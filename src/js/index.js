/* @flow */

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import init from "./initializers"
import lib from "./lib"

const store = init()

ReactDOM.render(
  <AppErrorBoundary dispatch={store.dispatch}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppErrorBoundary>,
  lib.doc.id("app-root")
)
