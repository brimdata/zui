import LakeShow from "app/lakes/show"
import LakeHome from "app/lakes/home"
import React from "react"
import {Route, Switch, useRouteMatch} from "react-router"
import {lakeImport, lakeShow} from "app/router/routes"

export default function Subroutes() {
  return (
    <Switch>
      <Route path={lakeImport.path}>
        <LakeHome />
      </Route>
      <Route path={lakeShow.path}>
        <LakeShow />
      </Route>
    </Switch>
  )
}
