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
import {InitPool, Show} from "src/pages/pools/show"
import {QueryRoute} from "src/app/query-home/route"
import Head from "next/head"
import {useTabId} from "src/app/core/hooks/use-tab-id"
import {NoTabsPane} from "src/panes/no-tabs-pane"

function AppRoutes() {
  return (
    <Switch>
      <Route path={routes.lakeReleaseNotes.path}>
        <ReleaseNotes />
      </Route>
      <Route path={routes.poolShow.path}>
        <InitPool>
          <Show />
        </InitPool>
      </Route>
      <Route path={routes.query.path}>
        <QueryRoute />
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
  )
}

function AppMain() {
  const tabId = useTabId()
  if (!tabId) {
    return <NoTabsPane />
  } else {
    return <AppRoutes />
  }
}

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
          <AppMain />
        </InitLake>
      </AppWrapper>
    </AppTabsRouter>
  )
}
