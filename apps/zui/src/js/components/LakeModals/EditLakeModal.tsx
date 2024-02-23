import React from "react"
import LakeForm from "./LakeForm"

import {H1} from "src/components/h1"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

const EditLakeModal = ({onClose}) => {
  const lake = useSelector(Current.getLake)

  return (
    <div className="box-s">
      <div className="stack-3">
        <H1>Edit Lake</H1>
        <LakeForm onClose={onClose} lake={lake} />
      </div>
    </div>
  )
}

export default EditLakeModal
