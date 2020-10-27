import React from "react"
import {Content, Footer, ModalDialog} from "../ModalDialog/ModalDialog"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import ToolbarButton from "../Toolbar/Button"
import Modal from "../../state/Modal"
import styled from "styled-components"
import StatusLight from "./StatusLight"

const StyledContent = styled(Content)`
  width: 100%;
`

const StyledFooter = styled(Footer)`
  display: flex;
  align-items: center;
  button {
    margin-left: 5px;
  }
`

const StyledConnectionDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;

  h1 {
    margin-bottom: 10px;
  }
`

const ConnectionFields = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  border: 1px solid var(--cloudy);
  border-radius: 10px;
  width: 100%;
`

const FieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  margin-left: 12px;
  border-bottom: 1px solid var(--cloudy);
  &:last-child {
    border: none;
  }

  label {
    ${(p) => p.theme.typography.labelBold}
  }

  p {
    color: var(--slate);
    ${(p) => p.theme.typography.labelSmall};
  }
`

const Status = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  p {
    text-transform: capitalize;
    margin: 5px;
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
        <h1>{name}</h1>
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
