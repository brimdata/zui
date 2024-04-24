import {InitLake} from "src/app/lakes/root"
import ReleaseNotes from "src/app/release-notes/release-notes"
import AppTabsRouter from "src/app/router/app-tabs-router"
import * as routes from "src/app/router/routes"
import AppWrapper from "src/app/routes/app-wrapper/app-wrapper"
import React from "react"
import {Route, Switch} from "react-router"
import useShortcuts from "./use-shortcuts"
import {useAppMenu} from "./use-app-menu"
import {WelcomePage} from "src/views/welcome-page"
import {useReleaseNotes} from "./use-release-notes"
import {InitPool, Show} from "src/views/pool-page"
import {SessionRoute} from "src/views/session-page/route"
import Head from "next/head"
import {useTabId} from "src/app/core/hooks/use-tab-id"
import {NoTabsPane} from "src/views/no-tabs-pane"
import {FilePage} from "src/views/file-page"

function AppRoutes() {
  return (
    <Switch>
      <Route path={routes.fileShow.path}>
        <FilePage />
      </Route>
      <Route path={routes.releaseNotes.path}>
        <ReleaseNotes />
      </Route>
      <Route path={routes.poolShow.path}>
        <InitPool>
          <Show />
        </InitPool>
      </Route>
      <Route path={routes.query.path}>
        <SessionRoute />
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

export default function Application() {
  useAppMenu()
  useReleaseNotes()
  useShortcuts()
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
