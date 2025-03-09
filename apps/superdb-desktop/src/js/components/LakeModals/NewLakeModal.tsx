import React from "react"
import LakeForm from "./LakeForm"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

const NewLakeModal = () => {
  const modal = usePopoverModal()
  return (
    <PopoverModal
      ref={modal.ref}
      className="max-width:measure box gutter-space-m"
    >
      <h1>New Lake</h1>
      <LakeForm onClose={modal.close} />
    </PopoverModal>
  )
}
export default NewLakeModal
