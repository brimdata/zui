import React from "react"
import LakeForm from "./LakeForm"

import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

const EditLakeModal = ({onClose}) => {
  const lake = useSelector(Current.getLake)

  return (
    <div className="box gutter-space-m">
      <h1>Edit Lake</h1>
      <LakeForm onClose={onClose} lake={lake} />
    </div>
  )
}

export default EditLakeModal
