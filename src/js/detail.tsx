
import "regenerator-runtime/runtime";

import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";

import AppErrorBoundary from "./components/AppErrorBoundary";
import initDetail from "./initializers/initDetail";
import lib from "./lib";
import LogDetailsWindow from "./components/LogDetailsWindow";
import WhoisModal from "./components/WhoisModal";

initDetail().then(store => {
  ReactDOM.render(<AppErrorBoundary dispatch={store.dispatch}>
      <Provider store={store}>
        <LogDetailsWindow />
        <WhoisModal />
      </Provider>
    </AppErrorBoundary>, lib.doc.id("app-root"));
});