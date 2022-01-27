import React from "react"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import LakeForm from "./LakeForm"

const NewLakeModal = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>New Lake</SmallTitle>
      <LakeForm onClose={onClose} />
    </Content>
  )
}
export default NewLakeModal
