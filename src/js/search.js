/* @flow */
import "regenerator-runtime/runtime"

import {Provider} from "react-redux"
import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"
import AppErrorBoundary from "./components/AppErrorBoundary"
import GlobalContext from "./state/GlobalContext"
import View from "./state/View"
import initializers from "./initializers"
import invoke from "./electron/ipc/invoke"
import ipc from "./electron/ipc"
import lib from "./lib"

initializers().then(({globalStore, store}) => {
  // put this somewhere else
  store.dispatch(View.setIsIngesting(true))
  invoke(ipc.zqd.subscribe()).then(() => {
    store.dispatch(View.setIsIngesting(false))
  })
  //

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
