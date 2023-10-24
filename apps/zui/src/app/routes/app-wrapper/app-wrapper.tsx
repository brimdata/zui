import React from "react"
import StatusBar from "src/js/components/status-bar/status-bar"
import TabBar from "src/js/components/TabBar/TabBar"
import {Sidebar} from "src/app/features/sidebar"
import {AppModals} from "./app-modals"
import {MainArea} from "./main-area"
import {AppGrid} from "./app-grid"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {DataDropzone} from "./data-dropzone"

export default function AppWrapper({children}) {
  const lakeId = useLakeId()
  return (
    <DataDropzone>
      <AppGrid>
        <TabBar key={lakeId} />
        <Sidebar />
        <MainArea>{children}</MainArea>
        <StatusBar />
        <AppModals />
      </AppGrid>
    </DataDropzone>
  )
}
