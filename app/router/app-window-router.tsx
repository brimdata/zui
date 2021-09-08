import React, {ReactElement} from "react"
import {Router} from "react-router"

export default function AppWindowRouter({children}: {children: ReactElement}) {
  return <Router history={global.windowHistory}>{children}</Router>
}
