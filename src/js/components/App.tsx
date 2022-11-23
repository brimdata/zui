import LakeList from "src/app/lakes/list"
import {InitLake} from "src/app/lakes/root"
import ReleaseNotes from "src/app/release-notes/release-notes"
import AppTabsRouter from "src/app/router/app-tabs-router"
import * as routes from "src/app/router/routes"
import AppWrapper from "src/app/routes/app-wrapper/app-wrapper"
import React from "react"
import {Route, Switch} from "react-router"
import useStoreExport from "src/app/core/hooks/useStoreExport"
import useSearchShortcuts from "./useSearchShortcuts"
import {useSearchAppMenu} from "src/pages/search/use-search-app-menu"
import {WelcomePage} from "src/pages/welcome"
import {useWelcomePage} from "src/application/use-welcome-page"
import {useReleaseNotes} from "src/application/use-release-notes"
import {PoolNew} from "src/pages/pools/new"
import {InitPool, Show} from "src/pages/pools/show"
import {QueryRoute} from "src/app/query-home/route"

export default function App() {
  useSearchAppMenu()
  useStoreExport()
  useWelcomePage()
  useReleaseNotes()
  useSearchShortcuts()

  return (
    <AppTabsRouter>
      <Switch>
        <Route path={routes.lakeShow.path}>
          <AppWrapper>
            <InitLake>
              <Switch>
                <Route path={routes.lakeReleaseNotes.path}>
                  <ReleaseNotes />
                </Route>
                <Route path={routes.lakeWelcome.path}>
                  <WelcomePage />
                </Route>
                <Route path={routes.poolNew.path}>
                  <PoolNew />
                </Route>
                <Route path={routes.poolShow.path}>
                  <InitPool>
                    <Show />
                  </InitPool>
                </Route>
                <Route path={routes.query.path}>
                  <QueryRoute />
                </Route>
                <Route default>
                  <WelcomePage />
                </Route>
              </Switch>
            </InitLake>
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
        <Route path="/">
          <AppWrapper>
            <LakeList />
          </AppWrapper>
        </Route>
      </Switch>
    </AppTabsRouter>
  )
}
