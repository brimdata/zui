import React from "react"
import {H1} from "src/components/h1"
import LakeForm from "./LakeForm"
import modals from "src/components/modal.module.css"

const NewLakeModal = ({onClose}) => {
  return (
    <div className={modals.form}>
      <H1 className={modals.title}>New Lake</H1>
      <LakeForm onClose={onClose} />
    </div>
  )
}
export default NewLakeModal
