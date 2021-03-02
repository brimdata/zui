import useLakeId from "app/router/hooks/use-lake-id"
import {lakeSearch, lakeSummary} from "app/router/routes"
import React, {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import {initSpace} from "src/js/flows/initSpace"
import {AppDispatch} from "src/js/state/types"
import SearchHome from "../search/home"
import SummaryHome from "../summary/home"

export default function LakeShow() {
  const match = useRouteMatch()
  return (
    <InitLake>
      <Switch>
        <Route path={lakeSearch.path}>
          <SearchHome />
        </Route>
        <Route path={lakeSummary.path}>
          <SummaryHome />
        </Route>
        <Route default>
          <Redirect to={`${match.url}/summary`} />
        </Route>
      </Switch>
    </InitLake>
  )
}

function InitLake({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useLakeId()
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (lakeId) {
      setFetching(true)
      dispatch(initSpace(lakeId)).finally(() => setFetching(false))
    }
  }, [lakeId])

  if (fetching) return null
  return children
}
