import React from "react"
import ReactDOM from "react-dom"
import {AppContainer} from "react-hot-loader"
import {Provider} from "react-redux"
import initStore from "./initStore"
import {HashRouter} from "react-router-dom"
import XApp from "./connectors/XApp"
const store = initStore()

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <HashRouter>
        <XApp />
      </HashRouter>
    </Provider>
  </AppContainer>,
  document.getElementById("app-root")
)
