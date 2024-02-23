import React from "react"
import {H1} from "src/components/h1"
import LakeForm from "./LakeForm"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

const NewLakeModal = () => {
  const modal = usePopoverModal()
  return (
    <PopoverModal ref={modal.ref} className="max-width:measure">
      <div className="box-s">
        <div className="stack-3">
          <H1>New Lake</H1>
          <LakeForm onClose={modal.close} />
        </div>
      </div>
    </PopoverModal>
  )
}
export default NewLakeModal
