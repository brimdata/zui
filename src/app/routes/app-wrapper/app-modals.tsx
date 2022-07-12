import React from "react"
import BrimToaster from "src/js/components/BrimToaster"
import BrimTooltip from "src/js/components/BrimTooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {Modals} from "src/js/components/Modals"
import PoolModal from "src/js/components/PoolModal"
import Preferences from "src/js/components/Preferences/Preferences"
import ColumnsModal from "../../columns/columns-modal"

export function AppModals() {
  return (
    <>
      <ErrorNotice />
      <Preferences />
      <Modals />
      <PoolModal />
      <ColumnsModal />
      <HTMLContextMenu />
      <BrimToaster />
      <BrimTooltip />
    </>
  )
}
