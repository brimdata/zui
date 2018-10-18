import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
import initStore from "./initializers/store"
import initShortcuts from "./initializers/shortcuts"
import "./globals"

const store = initStore()
initShortcuts(store)

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <XApp />
    </HashRouter>
  </Provider>,
  document.getElementById("app-root")
)
