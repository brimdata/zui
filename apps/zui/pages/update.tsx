import React, {useEffect, useState} from "react"
import {AppProvider} from "src/views/application/context"
import initialize from "src/js/initializers/initialize"
import {UpdateWindow} from "src/views/update-window"

export default function Update() {
  const [app, setApp] = useState(null)

  useEffect(() => {
    initialize().then((app) => setApp(app))
  }, [])

  if (!app) return null
  return (
    <AppProvider store={app.store} api={app.api}>
      <UpdateWindow />
    </AppProvider>
  )
}
