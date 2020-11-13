import React, {useState} from "react"
import {Content, Title} from "../ModalDialog/ModalDialog"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import ToolbarButton from "../Toolbar/Button"
import styled from "styled-components"
import StatusLight from "./StatusLight"
import EditConnectionModal from "./EditConnectionModal"
import useEnterKey from "../hooks/useEnterKey"
import ConnectionStatuses from "../../state/ConnectionStatuses"
import {remote} from "electron"
import Link from "../common/Link"
import removeConnection from "../../flows/removeConnection"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"

const StyledContent = styled(Content)`
  padding-top: 24px;
  min-width: 360px;
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

  a {
    flex: 1;
    color: var(--havelock);
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

const ViewConnection = ({onClose, onEdit}) => {
  const dispatch = useDispatch()
  const conn = useSelector(Current.getConnection)
  const connId = conn ? conn.id : null
  const spaceIds = useSelector(Spaces.ids(connId))
  const connStatus = useSelector(ConnectionStatuses.get(connId))

  useEnterKey(onClose)

  if (!conn) return null

  const spaceCount = spaceIds.length
  const {name, host, port, version = "unknown"} = conn

  const onRemove = () => {
    remote.dialog
      .showMessageBox({
        type: "warning",
        title: "Remove Connection",
        message: `Are you sure you want to remove ${name}?`,
        buttons: ["OK", "Cancel"]
      })
      .then(({response}) => {
        if (response === 0) {
          onClose()
          try {
            dispatch(removeConnection(conn))
          } catch (e) {
            dispatch(Notice.set(ErrorFactory.create(e)))
          }
        }
      })
  }

  return (
    <StyledContent>
      <StyledConnectionDetail>
        <Title>{name}</Title>
        <Status>
          <StatusLight status={connStatus} />
          <p>{connStatus || "unknown"}</p>
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
        <Link onClick={onRemove}>Remove</Link>
      </StyledFooter>
    </StyledContent>
  )
}

const ViewConnectionModal = ({onClose}) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <EditConnectionModal onClose={() => setEditing(false)} />
  } else {
    return <ViewConnection onClose={onClose} onEdit={() => setEditing(true)} />
  }
}

export default ViewConnectionModal
