import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import initStore from "./initStore"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
import shortcuts from "./initializers/shortcuts"
import "./globals"

const store = initStore()
shortcuts(store)

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <XApp />
    </HashRouter>
  </Provider>,
  document.getElementById("app-root")
)
