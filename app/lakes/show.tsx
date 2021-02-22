import useLakeId from "app/router/hooks/use-lake-id"
import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import {Switch, Route, useRouteMatch, Redirect} from "react-router"
import {initSpace} from "src/js/flows/initSpace"
import SearchHome from "../search/home"
import SummaryHome from "../summary/home"

export default function LakeShow() {
  const match = useRouteMatch()
  const dispatch = useDispatch()
  const lakeId = useLakeId()

  useEffect(() => {
    if (lakeId) dispatch(initSpace(lakeId))
  }, [lakeId])

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
