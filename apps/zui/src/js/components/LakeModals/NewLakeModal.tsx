import React from "react"
import {H1} from "src/components/h1"
import LakeForm from "./LakeForm"
import modals from "src/components/modals.module.css"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

const NewLakeModal = () => {
  const modal = usePopoverModal()
  return (
    <PopoverModal>
      <div className="box-s width:measure">
        <div className="stack-3">
          <H1 className={modals.title}>New Lake</H1>
          <LakeForm onClose={modal.close} />
        </div>
      </div>
    </PopoverModal>
  )
}
export default NewLakeModal
