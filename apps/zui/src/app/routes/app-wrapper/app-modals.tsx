import React from "react"
import Toaster from "src/js/components/Toaster"
import Tooltip from "src/js/components/Tooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {Modals} from "src/js/components/Modals"
import Preferences from "src/js/components/Preferences/Preferences"
import {LoadPane} from "src/panes/load-pane"

export function AppModals() {
  return (
    <>
      <ErrorNotice />
      <Preferences />
      <Modals />
      <HTMLContextMenu />
      <Toaster />
      <Tooltip />
      <LoadPane />
    </>
  )
}
