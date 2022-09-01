import LakeList from "src/app/lakes/list"
import LakeRoot from "src/app/lakes/root"
import {maybeShowReleaseNotes} from "src/app/release-notes/maybe-show-release-notes"
import ReleaseNotes from "src/app/release-notes/release-notes"
import AppTabsRouter from "src/app/router/app-tabs-router"
import {releaseNotes, root, lakeShow, lakeList} from "src/app/router/routes"
import AppWrapper from "src/app/routes/app-wrapper/app-wrapper"
import React, {useEffect} from "react"
import {Redirect, Route, Switch} from "react-router"
import useStoreExport from "src/app/core/hooks/useStoreExport"
import {defaultLake} from "../initializers/initLakeParams"
import Handlers from "../state/Handlers"
import useSearchShortcuts from "./useSearchShortcuts"
import {useDispatch} from "src/app/core/state"
import {useSearchAppMenu} from "src/pages/search/use-search-app-menu"

export default function App() {
  useSearchAppMenu()
  useStoreExport()
  const dispatch = useDispatch()
  useSearchShortcuts()
  useEffect(() => {
    dispatch(maybeShowReleaseNotes())
    return () => {
      dispatch(Handlers.abortAll())
    }
  }, [])

  return (
    <AppTabsRouter>
      <Switch>
        <Route path={lakeShow.path}>
          <AppWrapper>
            <LakeRoot />
          </AppWrapper>
        </Route>
        <Route path={lakeList.path}>
          <AppWrapper>
            <LakeList />
          </AppWrapper>
        </Route>
        <Route path={releaseNotes.path}>
          <AppWrapper>
            <ReleaseNotes />
          </AppWrapper>
        </Route>
        <Route path={root.path}>
          <Redirect to={`/lakes/${defaultLake().id}`} />
        </Route>
      </Switch>
    </AppTabsRouter>
  )
}
