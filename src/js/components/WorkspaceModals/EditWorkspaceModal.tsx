import React from "react"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import styled from "styled-components"
import WorkspaceForm from "./WorkspaceForm"

const StyledContent = styled(Content)`
  min-width: 360px;
`

const EditWorkspaceModal = ({onClose}) => {
  const workspace = useSelector(Current.getWorkspace)

  return (
    <StyledContent>
      <SmallTitle>Edit Workspace</SmallTitle>
      <WorkspaceForm onClose={onClose} workspace={workspace.serialize()} />
    </StyledContent>
  )
}

export default EditWorkspaceModal
