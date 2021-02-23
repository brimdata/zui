import React from "react"
import {Router} from "react-router"

export default function AppRouter({children}) {
  return <Router history={global.tabHistory}>{children}</Router>
}
