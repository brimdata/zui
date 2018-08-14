import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import initStore from "./initStore"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require("electron-devtools-installer")

installExtension(REACT_DEVELOPER_TOOLS)
  .then(name => console.log(`Added Extension:  ${name}`))
  .catch(err => console.log("An error occurred: ", err))

installExtension(REDUX_DEVTOOLS)
  .then(name => console.log(`Added Extension:  ${name}`))
  .catch(err => console.log("An error occurred: ", err))

const store = initStore()

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <XApp />
    </HashRouter>
  </Provider>,
  document.getElementById("app-root")
)
