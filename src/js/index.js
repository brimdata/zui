/* @flow */

import {HashRouter} from "react-router-dom"
import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import {XApp} from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import * as Doc from "./lib/Doc"
import init from "./initializers"

const store = init()

ReactDOM.render(
  <AppErrorBoundary dispatch={store.dispatch}>
    <Provider store={store}>
      <HashRouter>
        <XApp />
      </HashRouter>
    </Provider>
  </AppErrorBoundary>,
  Doc.id("app-root")
)
