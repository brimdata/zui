import {useSelector, useDispatch} from "react-redux"
import Modal from "../state/Modal"
import WhoisModal from "./WhoisModal"
import React, {useRef} from "react"
import NewLakeModal from "./LakeModals/NewLakeModal"
import ViewLakeModal from "./LakeModals/ViewLakeModal"
import {NewPoolModal} from "src/views/new-pool-modal"
import {Dialog} from "src/components/dialog"
import {ExportModal} from "src/views/export-modal"
import {transitionsComplete} from "src/util/watch-transition"

const MODALS = {
  whois: WhoisModal,
  "new-lake": NewLakeModal,
  "view-lake": ViewLakeModal,
  export: ExportModal,
  "new-pool": NewPoolModal,
}

export function Modals() {
  const name = useSelector(Modal.getName)
  const dispatch = useDispatch()
  const Component = MODALS[name]
  const dialog = useRef(null)

  if (!Component) return null

  async function onClose(e) {
    await transitionsComplete(e.currentTarget)
    dispatch(Modal.hide())
  }

  return (
    <Dialog
      ref={dialog}
      onClose={onClose}
      dialogPoint="center center"
      isOpen={true}
      className="modal popover"
      modal
    >
      <Component onClose={() => dialog.current.close()} />
    </Dialog>
  )
}
