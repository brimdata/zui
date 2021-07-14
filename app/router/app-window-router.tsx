import React from "react"
import {Router} from "react-router"

export default function AppWindowRouter({children}) {
  return <Router history={global.windowHistory}>{children}</Router>
}
