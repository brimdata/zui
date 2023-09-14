import {useSelector, useDispatch} from "react-redux"
import Modal from "../state/Modal"
import IngestWarningsModal from "./IngestWarningsModal"
import WhoisModal from "./WhoisModal"
import React from "react"
import NewLakeModal from "./LakeModals/NewLakeModal"
import ViewLakeModal from "./LakeModals/ViewLakeModal"
import ExportModal from "./ExportModal"
import {NewPoolModal} from "src/panes/new-pool-modal"
import {Debut, useDebut} from "src/components/debut"
import {Dialog} from "src/components/dialog/dialog"
import modalStyle from "src/components/modals.module.css"

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
  const Component = MODALS[name]
  const debut = useDebut({afterExit: () => dispatch(Modal.hide())})

  if (!Component) return null
  return (
    <Debut {...debut.props} classNames="modal">
      <Dialog
        onClose={() => debut.exit()}
        dialogPoint="center center"
        isOpen={true}
        className={modalStyle.modal}
        modal
      >
        <Component onClose={() => debut.exit()} />
      </Dialog>
    </Debut>
  )
}
