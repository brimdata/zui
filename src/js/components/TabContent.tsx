import WorkspacesList from "app/workspaces/list"
import WorkspaceShow from "app/workspaces/show"
import React from "react"
import {Route, Switch} from "react-router"

export default function TabContent() {
  return (
    <Switch>
      <Route path="/workspaces/:workspaceId">
        <WorkspaceShow />
      </Route>
      <Route path="/workspaces">
        <WorkspacesList />
      </Route>
    </Switch>
  )
}
