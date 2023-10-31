import React, {useEffect, useState} from "react"
import {AppProvider} from "src/app/core/context"
import {invoke} from "src/core/invoke"
import initialize from "src/js/initializers/initialize"
import {UpdateWindow} from "src/views/update-window"

export default function Update() {
  const [app, setApp] = useState(null)
  useEffect(() => {
    initialize().then((app) => {
      setApp(app)
      invoke("updates.check")
    })
  }, [])

  if (!app) return null
  return (
    <AppProvider store={app.store} api={app.api}>
      <UpdateWindow />
    </AppProvider>
  )
}
