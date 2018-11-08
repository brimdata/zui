/* @flow */

import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
import AppErrorBoundary from "./components/AppErrorBoundary"
import * as Doc from "./lib/Doc"
import init from "./initializers"

const store = init()

ReactDOM.render(
  <AppErrorBoundary>
    <Provider store={store}>
      <HashRouter>
        <XApp />
      </HashRouter>
    </Provider>
  </AppErrorBoundary>,
  Doc.id("app-root")
)
