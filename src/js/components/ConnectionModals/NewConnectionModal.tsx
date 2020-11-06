import React from "react"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import ConnectionForm from "./ConnectionForm"

const NewConnectionModal = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>New Connection</SmallTitle>
      <ConnectionForm onClose={onClose} />
    </Content>
  )
}
export default NewConnectionModal
