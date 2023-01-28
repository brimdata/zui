import React from "react"
import BrimToaster from "src/js/components/BrimToaster"
import BrimTooltip from "src/js/components/BrimTooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {Modals} from "src/js/components/Modals"
import Preferences from "src/js/components/Preferences/Preferences"

export function AppModals() {
  return (
    <>
      <ErrorNotice />
      <Preferences />
      <Modals />
      <HTMLContextMenu />
      <BrimToaster />
      <BrimTooltip />
    </>
  )
}
