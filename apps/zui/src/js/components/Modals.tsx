import {useSelector} from "react-redux"
import Modal from "../state/Modal"
import WhoisModal from "./WhoisModal"
import React from "react"
import NewLakeModal from "./LakeModals/NewLakeModal"
import ViewLakeModal from "./LakeModals/ViewLakeModal"
import {NewPoolModal} from "src/views/new-pool-modal"
import {ExportModal} from "src/views/export-modal"
import {PreviewLoadModal} from "src/views/preview-load-modal"

export const MODALS = {
  whois: WhoisModal,
  "new-lake": NewLakeModal,
  "view-lake": ViewLakeModal,
  export: ExportModal,
  "new-pool": NewPoolModal,
  "preview-load": PreviewLoadModal,
}

export function Modals() {
  const name = useSelector(Modal.getName)
  const Component = MODALS[name]
  if (!Component) return null
  return <Component />
}
