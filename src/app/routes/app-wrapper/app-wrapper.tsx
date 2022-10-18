import React from "react"
import StatusBar from "src/js/components/status-bar/status-bar"
import TabBar from "src/js/components/TabBar/TabBar"
import {Sidebar} from "src/app/features/sidebar"
import {AppModals} from "./app-modals"
import {MainArea} from "./main-area"
import {AppGrid} from "./app-grid"

export default function AppWrapper({children}) {
  return (
    <AppGrid>
      <TabBar />
      <Sidebar />
      <MainArea>{children}</MainArea>
      <StatusBar />

      <AppModals />
    </AppGrid>
  )
}
