import React from "react"
import {H1} from "src/components/h1"
import {Content} from "../ModalDialog/ModalDialog"
import LakeForm from "./LakeForm"

const NewLakeModal = ({onClose}) => {
  return (
    <Content>
      <H1>New Lake</H1>
      <LakeForm onClose={onClose} />
    </Content>
  )
}
export default NewLakeModal
