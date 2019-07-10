/* @flow */

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import * as Doc from "./lib/Doc"
import init from "./initializers"

const store = init()

ReactDOM.render(
  <AppErrorBoundary dispatch={store.dispatch}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppErrorBoundary>,
  Doc.id("app-root")
)
