import React from "react"
import {Content, ModalDialog, SmallTitle} from "../ModalDialog/ModalDialog"
import ConnectionForm from "./ConnectionForm"
import Modal from "../../state/Modal"
import {useDispatch, useSelector} from "react-redux"

const NewConnectionModalContents = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>New Connection</SmallTitle>
      <ConnectionForm onClose={onClose} />
    </Content>
  )
}

const NewConnectionModal = () => {
  const dispatch = useDispatch()
  const name = useSelector(Modal.getName)
  const onClose = () => dispatch(Modal.hide())
  if (name === "new-connection")
    return (
      <ModalDialog onClosed={onClose}>{NewConnectionModalContents}</ModalDialog>
    )

  return null
}

export default NewConnectionModal
