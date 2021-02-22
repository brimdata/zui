import LakeShow from "app/lakes/show"
import LakeHome from "app/lakes/home"
import React from "react"
import {Route, Switch, useRouteMatch} from "react-router"

export default function Subroutes() {
  const match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.path}/lakes/import`}>
        <LakeHome />
      </Route>
      <Route path={`${match.path}/lakes/:lakeId`}>
        <LakeShow />
      </Route>
    </Switch>
  )
}
