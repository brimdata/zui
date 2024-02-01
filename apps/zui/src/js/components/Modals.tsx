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
  // return (
  //   <Dialog
  //     ref={dialog}
  //     onClose={onClose}
  //     dialogPoint="center center"
  //     isOpen={true}
  //     className="modal popover"
  //     modal
  //   >
  //     <Component dialogRef={dialog} />
  //   </Dialog>
  // )
}
