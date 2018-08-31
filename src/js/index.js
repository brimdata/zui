import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import initStore from "./initStore"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
import initShortcuts from "./initShortcuts"

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
