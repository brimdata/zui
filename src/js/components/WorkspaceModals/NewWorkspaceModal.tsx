import React from "react"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import WorkspaceForm from "./WorkspaceForm"

const NewWorkspaceModal = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>New Workspace</SmallTitle>
      <WorkspaceForm onClose={onClose} />
    </Content>
  )
}
export default NewWorkspaceModal
