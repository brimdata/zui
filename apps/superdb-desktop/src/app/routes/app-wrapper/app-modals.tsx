import React from "react"
import Toaster from "src/js/components/Toaster"
import {Tooltip} from "src/components/tooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {Modals} from "src/js/components/Modals"

export function AppModals() {
  return (
    <>
      <ErrorNotice />
      <Modals />
      <HTMLContextMenu />
      <Toaster />
      <Tooltip />
    </>
  )
}
