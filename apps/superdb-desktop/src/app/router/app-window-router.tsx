import React from "react"
import {Router} from "react-router"

export default function AppWindowRouter({children}) {
  // @ts-ignore Fixing type here requires upgrading react-router from v5 => v6
  return <Router history={global.windowHistory}>{children}</Router>
}
