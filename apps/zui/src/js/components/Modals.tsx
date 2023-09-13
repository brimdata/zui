import {useSelector, useDispatch} from "react-redux"
import Modal from "../state/Modal"
import IngestWarningsModal from "./IngestWarningsModal"
import WhoisModal from "./WhoisModal"
import React from "react"
import {ModalDialog} from "./ModalDialog/ModalDialog"
import NewLakeModal from "./LakeModals/NewLakeModal"
import ViewLakeModal from "./LakeModals/ViewLakeModal"
import ExportModal from "./ExportModal"
import {NewPoolModal} from "src/panes/new-pool-modal"

const MODALS = {
  whois: WhoisModal,
  "ingest-warnings": IngestWarningsModal,
  "new-lake": NewLakeModal,
  "view-lake": ViewLakeModal,
  export: ExportModal,
  "new-pool": NewPoolModal,
}

export function Modals() {
  const name = useSelector(Modal.getName)
  const dispatch = useDispatch()
  const modal = MODALS[name]

  if (!modal) return null
  return (
    <ModalDialog onClosed={() => dispatch(Modal.hide())}>{modal}</ModalDialog>
  )
}
