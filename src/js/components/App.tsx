import LakeList from "src/app/lakes/list"
import LakeRoot from "src/app/lakes/root"
import ReleaseNotes from "src/app/release-notes/release-notes"
import AppTabsRouter from "src/app/router/app-tabs-router"
import * as routes from "src/app/router/routes"
import AppWrapper from "src/app/routes/app-wrapper/app-wrapper"
import React from "react"
import {Redirect, Route, Switch} from "react-router"
import useStoreExport from "src/app/core/hooks/useStoreExport"
import {defaultLake} from "../initializers/initLakeParams"
import useSearchShortcuts from "./useSearchShortcuts"
import {useSearchAppMenu} from "src/pages/search/use-search-app-menu"
import {WelcomePage} from "src/pages/welcome"
import {useWelcomePage} from "src/application/use-welcome-page"
import {useReleaseNotes} from "src/application/use-release-notes"
import {useHandlersCleanup} from "src/application/use-app-unmount"
import {lakeImportPath} from "src/app/router/utils/paths"

export default function App() {
  useSearchAppMenu()
  useStoreExport()
  useWelcomePage()
  useReleaseNotes()
  useSearchShortcuts()
  useHandlersCleanup()

  return (
    <AppTabsRouter>
      <Switch>
        <Route path={routes.lakeShow.path}>
          <AppWrapper>
            <LakeRoot />
          </AppWrapper>
        </Route>
        <Route path={routes.lakeList.path}>
          <AppWrapper>
            <LakeList />
          </AppWrapper>
        </Route>
        <Route path={routes.releaseNotes.path}>
          <AppWrapper>
            <ReleaseNotes />
          </AppWrapper>
        </Route>
        <Route path={routes.welcome.path}>
          <AppWrapper>
            <WelcomePage />
          </AppWrapper>
        </Route>
        <Route path={routes.root.path}>
          <Redirect to={lakeImportPath(defaultLake().id)} />
        </Route>
      </Switch>
    </AppTabsRouter>
  )
}
