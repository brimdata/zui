import React from "react"
import Toaster from "src/js/components/Toaster"
import {Tooltip} from "src/components/tooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {Modals} from "src/js/components/Modals"
import {PreferencesModal} from "src/views/preferences-modal"
import {LoadPane} from "src/views/load-pane"

export function AppModals() {
  return (
    <>
      <ErrorNotice />
      <PreferencesModal />
      <Modals />
      <HTMLContextMenu />
      <Toaster />
      <Tooltip />
      <LoadPane />
    </>
  )
}
