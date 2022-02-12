import React from "react"
import {useSelector} from "react-redux"
import styled from "styled-components"
import Current from "../../state/Current"
import {Content, SmallTitle} from "../ModalDialog/ModalDialog"
import LakeForm from "./LakeForm"

const StyledContent = styled(Content)`
  min-width: 360px;
`

const EditLakeModal = ({onClose}) => {
  const lake = useSelector(Current.getLake)

  return (
    <StyledContent>
      <SmallTitle>Edit Lake</SmallTitle>
      <LakeForm onClose={onClose} lake={lake} />
    </StyledContent>
  )
}

export default EditLakeModal
