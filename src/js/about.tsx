import React from "react"

import AboutWindow from "./components/AboutWindow"
import lib from "./lib"
import {createRoot} from "react-dom/client"

const container = lib.doc.id("about-root")
const root = createRoot(container!)
root.render(<AboutWindow />)
