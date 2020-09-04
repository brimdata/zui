

import React from "react";
import ReactDOM from "react-dom";

import AboutWindow from "./components/AboutWindow";
import lib from "./lib";

ReactDOM.render(<AboutWindow />, lib.doc.id("about-root"));