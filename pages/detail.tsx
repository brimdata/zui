import {invoke} from "lodash"
import React, {useEffect, useState} from "react"
import {AppProvider} from "src/app/core/context"
import AppWindowRouter from "src/app/router/app-window-router"
import LogDetailsWindow from "src/js/components/LogDetailsWindow"
import {Modals} from "src/js/components/Modals"
import Tooltip from "src/js/components/Tooltip"
import initialize from "src/js/initializers/initialize"
import TabHistories from "src/js/state/TabHistories"
import {getPersistedWindowState} from "src/js/state/stores/get-persistable"

export default function DetailPage() {
  const [app, setApp] = useState(null)

  useEffect(() => {
    initialize().then((vars) => {
      window.onbeforeunload = () => {
        vars.api.abortables.abortAll()
        vars.store.dispatch(TabHistories.save(global.tabHistories.serialize()))
        invoke(
          "autosaveOp",
          global.windowId,
          getPersistedWindowState(vars.store.getState())
        )
      }
      setApp(vars)
    })
  }, [])

  if (!app) return null

  return (
    <AppProvider store={app.store} api={app.api}>
      <AppWindowRouter>
        <div id="modal-dialog-root" />
        <LogDetailsWindow />
        <Modals />
        <Tooltip />
      </AppWindowRouter>
    </AppProvider>
  )
}
