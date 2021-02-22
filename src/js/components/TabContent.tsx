import React, {useEffect} from "react"

import {Switch, Route, useHistory} from "react-router"
import WorkspaceShow from "app/workspaces/show"
import WorkspacesList from "app/workspaces/list"

export default function TabContent() {
  const history = useHistory()
  useEffect(() => {
    history.push("/workspaces")
  }, [])
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
