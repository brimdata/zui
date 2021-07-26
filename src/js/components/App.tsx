import {maybeShowReleaseNotes} from "app/release-notes/maybe-show-release-notes"
import ReleaseNotes from "app/release-notes/release-notes"
import AppTabsRouter from "app/router/app-tabs-router"
import {
  releaseNotes,
  root,
  workspaceShow,
  workspacesList
} from "app/router/routes"
import AppWrapper from "app/routes/app-wrapper"
import WorkspacesList from "app/workspaces/list"
import WorkspaceShow from "app/workspaces/show"
import {ipcRenderer} from "electron"
import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import {Redirect, Route, Switch} from "react-router"
import useStoreExport from "../../../app/core/hooks/useStoreExport"
import Handlers from "../state/Handlers"
import useSearchShortcuts from "./useSearchShortcuts"

export default function App() {
  useStoreExport()
  const dispatch = useDispatch()
  useSearchShortcuts()
  useEffect(() => {
    ipcRenderer.invoke("windows:ready")
    dispatch(maybeShowReleaseNotes())
    return () => {
      dispatch(Handlers.abortAll())
    }
  }, [])

  return (
    <AppTabsRouter>
      <Switch>
        <Route path={workspaceShow.path}>
          <AppWrapper>
            <WorkspaceShow />
          </AppWrapper>
        </Route>
        <Route path={workspacesList.path}>
          <AppWrapper>
            <WorkspacesList />
          </AppWrapper>
        </Route>
        <Route path={releaseNotes.path}>
          <AppWrapper>
            <ReleaseNotes />
          </AppWrapper>
        </Route>
        <Route path={root.path}>
          <Redirect to="/workspaces/localhost:9867" />
        </Route>
      </Switch>
    </AppTabsRouter>
  )
}
