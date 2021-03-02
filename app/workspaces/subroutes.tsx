import LakeHome from "app/lakes/home"
import LakeShow from "app/lakes/show"
import {lakeImport, lakeShow} from "app/router/routes"
import React from "react"
import {Route, Switch} from "react-router"

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
