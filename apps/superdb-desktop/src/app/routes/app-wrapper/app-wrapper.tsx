import React from "react"
import {Sidebar} from "src/views/sidebar"
import {AppModals} from "./app-modals"
import {MainArea} from "./main-area"
import {AppGrid} from "./app-grid"
import {DataDropzone} from "./data-dropzone"
import RightPane from "src/views/right-pane"
import {TabBar} from "src/views/tab-bar"

export default function AppWrapper({children}) {
  return (
    <DataDropzone>
      <AppGrid>
        <TabBar />
        <Sidebar />
        <MainArea>{children}</MainArea>
        <RightPane />
        <AppModals />
      </AppGrid>
    </DataDropzone>
  )
}
