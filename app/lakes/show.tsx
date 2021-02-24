import useLakeId from "app/router/hooks/use-lake-id"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import {initSpace} from "src/js/flows/initSpace"
import Current from "src/js/state/Current"
import SearchHome from "../search/home"
import SummaryHome from "../summary/home"

export default function LakeShow() {
  const dispatch = useDispatch()
  const lakeId = useLakeId()
  const lake = useSelector(Current.mustGetSpace)

  useEffect(() => {
    if (lakeId) dispatch(initSpace(lakeId))
  }, [lakeId])

  return lake.empty() ? null : <Subroutes />
}

function Subroutes() {
  const match = useRouteMatch()
  return (
    <Switch>
      <Route path={`${match.path}/search`}>
        <SearchHome />
      </Route>
      <Route path={`${match.path}/summary`}>
        <SummaryHome />
      </Route>
      <Route default>
        <Redirect to={`${match.url}/summary`} />
      </Route>
    </Switch>
  )
}
