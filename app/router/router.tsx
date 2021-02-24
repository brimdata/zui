import React, {useEffect} from "react"
import {Router} from "react-router"

export default function AppRouter({children}) {
  useEffect(() => {
    return global.tabHistory.listen((location, action) => {
      console.log(action, location.pathname + location.search)
    })
  }, [global.tabHistory])
  return <Router history={global.tabHistory}>{children}</Router>
}
