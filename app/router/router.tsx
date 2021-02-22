import React from "react"
import {createMemoryHistory} from "react-router/node_modules/history"
import {Router} from "react-router"
const history = createMemoryHistory()
export type TabHistory = typeof history
global.tabHistory = history

history.listen((location, action) => console.log(action, location))

export const createHistory = createMemoryHistory

export default function AppRouter({children}) {
  return <Router history={history}>{children}</Router>
}
