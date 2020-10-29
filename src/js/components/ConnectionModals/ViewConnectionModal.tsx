import React from "react"
import {Content, ModalDialog, Title} from "../ModalDialog/ModalDialog"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import ToolbarButton from "../Toolbar/Button"
import Modal from "../../state/Modal"
import styled from "styled-components"
import StatusLight from "./StatusLight"

const StyledContent = styled(Content)`
  padding-top: 24px;
  min-width: 330px;
  width: 100%;
`

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 12px;

  button {
    margin-left: 12px;
  }
`

const StyledConnectionDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const ConnectionFields = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.75);
  flex-direction: column;
  border-radius: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 24px;
  width: 100%;
`

const FieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  margin-left: 12px;
  height: 30px;
  position: relative;

  &:last-child:after {
    display: none;
  }

  &:after {
    width: 100%;
    height: 1px;
    box-shadow: 0 0.5px 0 var(--aqua);
    opacity: 0.1;
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
  }

  label {
    ${(p) => p.theme.typography.labelNormal}
  }

  p {
    color: var(--slate);
    ${(p) => p.theme.typography.labelNormal};
    margin: 0;
  }
`

const Status = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  p {
    text-transform: capitalize;
    margin: 0 0 0 6px;
  }
`

type FieldProps = {
  label: string
  value: string
}

const Field = ({label, value}: FieldProps) => {
  return (
    <FieldWrapper>
      <label>{label}</label>
      <p>{value}</p>
    </FieldWrapper>
  )
}

const ViewConnectionModalContents = ({onClose}) => {
  const dispatch = useDispatch()
  const conn = useSelector(Current.getConnection)
  const spaceIds = useSelector(Spaces.ids(conn.id))
  const spaceCount = spaceIds.length

  const {name, host, port, status, version = "unknown"} = conn

  const onEdit = () => {
    dispatch(Modal.show("edit-connection"))
  }

  return (
    <StyledContent>
      <StyledConnectionDetail>
        <Title>{name}</Title>
        <Status>
          <StatusLight status={status} />
          <p>{status}</p>
        </Status>
        <ConnectionFields>
          <Field label="Host" value={[host, port].join(":")} />
          <Field label="ZQD Version" value={version} />
          <Field label="Spaces" value={`${spaceCount}`} />
        </ConnectionFields>
      </StyledConnectionDetail>
      <StyledFooter>
        <ToolbarButton text="OK" onClick={onClose} />
        <ToolbarButton text="Edit" onClick={onEdit} />
      </StyledFooter>
    </StyledContent>
  )
}

const ViewConnectionModal = () => {
  const dispatch = useDispatch()
  const name = useSelector(Modal.getName)
  const onClose = () => dispatch(Modal.hide())
  if (name === "view-connection")
    return (
      <ModalDialog onClosed={onClose}>
        {ViewConnectionModalContents}
      </ModalDialog>
    )

  return null
}

export default ViewConnectionModal
