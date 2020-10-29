import React from "react"
import {Content, ModalDialog, SmallTitle} from "../ModalDialog/ModalDialog"
import ConnectionForm from "./ConnectionForm"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import Modal from "../../state/Modal"

const EditConnectionModalContents = ({onClose}) => {
  const conn = useSelector(Current.getConnection)

  return (
    <Content>
      <SmallTitle>Edit Connection</SmallTitle>
      <ConnectionForm onClose={onClose} conn={conn} />
    </Content>
  )
}

const EditConnectionModal = () => {
  const dispatch = useDispatch()
  const name = useSelector(Modal.getName)
  const onClose = () => dispatch(Modal.hide())
  if (name === "edit-connection")
    return (
      <ModalDialog onClosed={onClose}>
        {EditConnectionModalContents}
      </ModalDialog>
    )

  return null
}

export default EditConnectionModal
