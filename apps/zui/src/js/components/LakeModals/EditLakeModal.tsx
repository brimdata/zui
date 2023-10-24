import React from "react"
import LakeForm from "./LakeForm"

import modals from "src/components/modals.module.css"
import {H1} from "src/components/h1"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

const EditLakeModal = ({onClose}) => {
  const lake = useSelector(Current.getLake)

  return (
    <div className={modals.form}>
      <H1 className={modals.title}>Edit Lake</H1>
      <LakeForm onClose={onClose} lake={lake} />
    </div>
  )
}

export default EditLakeModal
