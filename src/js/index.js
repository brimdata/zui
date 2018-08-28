import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import initStore from "./initStore"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
import initShortcuts from "./initShortcuts"

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require("electron-devtools-installer")

installExtension(REACT_DEVELOPER_TOOLS).catch(err =>
  console.log("An error occurred: ", err)
)

installExtension(REDUX_DEVTOOLS).catch(err =>
  console.log("An error occurred: ", err)
)

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
