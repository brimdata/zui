import {useSelector, useDispatch} from "react-redux"
import Modal from "../state/Modal"
import {DebugModal} from "./DebugModal"
import IngestWarningsModal from "./IngestWarningsModal"
import WhoisModal from "./WhoisModal"
import ZQModal from "./ZQModal"
import CurlModal from "./CurlModal"
import React from "react"
import {ModalDialog} from "./ModalDialog/ModalDialog"
import NewConnectionModal from "./ConnectionModals/NewConnectionModal"
import ViewConnectionModal from "./ConnectionModals/ViewConnectionModal"
import NewQueryModal from "./QueriesModals/NewQueryModal"
import EditQueryModal from "./QueriesModals/EditQueryModal"
import ExportModal from "./ExportModal"

const MODALS = {
  debug: DebugModal,
  whois: WhoisModal,
  curl: CurlModal,
  zq: ZQModal,
  "ingest-warnings": IngestWarningsModal,
  "new-connection": NewConnectionModal,
  "view-connection": ViewConnectionModal,
  "new-query": NewQueryModal,
  "edit-query": EditQueryModal,
  export: ExportModal
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
