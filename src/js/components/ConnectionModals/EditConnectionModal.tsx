import React from "react"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import ConnectionForm from "./ConnectionForm"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import styled from "styled-components"

const StyledContent = styled(Content)`
  min-width: 360px;
`

const EditConnectionModal = ({onClose}) => {
  const conn = useSelector(Current.getConnection)

  return (
    <StyledContent>
      <SmallTitle>Edit Connection</SmallTitle>
      <ConnectionForm onClose={onClose} conn={conn} />
    </StyledContent>
  )
}

export default EditConnectionModal
