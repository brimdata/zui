import LakeList from "src/app/lakes/list"
import {InitLake} from "src/app/lakes/root"
import ReleaseNotes from "src/app/release-notes/release-notes"
import AppTabsRouter from "src/app/router/app-tabs-router"
import * as routes from "src/app/router/routes"
import AppWrapper from "src/app/routes/app-wrapper/app-wrapper"
import React from "react"
import {Route, Switch} from "react-router"
import useSearchShortcuts from "./useSearchShortcuts"
import {useSearchAppMenu} from "src/pages/search/use-search-app-menu"
import {WelcomePage} from "src/pages/welcome"
import {useReleaseNotes} from "src/application/use-release-notes"
import {PoolNew} from "src/pages/pools/new"
import {InitPool, Show} from "src/pages/pools/show"
import {QueryRoute} from "src/app/query-home/route"
import Head from "next/head"

export default function App() {
  useSearchAppMenu()
  useReleaseNotes()
  useSearchShortcuts()
  return (
    <AppTabsRouter>
      <Head>
        <title>Zui</title>
      </Head>
      <AppWrapper>
        <InitLake>
          <Switch>
            <Route path={routes.lakeReleaseNotes.path}>
              <ReleaseNotes />
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
            <Route path={routes.lakeList.path}>
              <LakeList />
            </Route>
            <Route path={routes.releaseNotes.path}>
              <ReleaseNotes />
            </Route>
            <Route path={routes.welcome.path}>
              <WelcomePage />
            </Route>
            <Route default>
              <WelcomePage />
            </Route>
          </Switch>
        </InitLake>
      </AppWrapper>
    </AppTabsRouter>
  )
}
