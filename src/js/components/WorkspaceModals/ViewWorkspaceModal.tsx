import React, {useState} from "react"
import {Content, Title} from "../ModalDialog/ModalDialog"
import {useDispatch, useSelector} from "react-redux"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import ToolbarButton from "../../../../app/toolbar/button"
import styled from "styled-components"
import StatusLight from "./StatusLight"
import EditWorkspaceModal from "./EditWorkspaceModal"
import useEnterKey from "../hooks/useEnterKey"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {remote} from "electron"
import Link from "../common/Link"
import removeWorkspace from "../../flows/removeWorkspace"
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
    margin-right: auto;
    color: var(--red);
  }
`

const StyledWorkspaceDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const WorkspaceFields = styled.div`
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

const ViewWorkspace = ({onClose, onEdit}) => {
  const dispatch = useDispatch()
  const workspace = useSelector(Current.getWorkspace)
  const workspaceId = workspace ? workspace.id : null
  const spaceIds = useSelector(Spaces.ids(workspaceId))
  const wsStatus = useSelector(WorkspaceStatuses.get(workspaceId))

  useEnterKey(onClose)

  if (!workspace) return null

  const isDefault = workspace.id === "localhost:9867"

  const spaceCount = spaceIds.length
  const {name, host, port, version = "unknown"} = workspace

  const onRemove = () => {
    remote.dialog
      .showMessageBox({
        type: "warning",
        title: "Remove Workspace",
        message: `Are you sure you want to remove ${name}?`,
        buttons: ["OK", "Cancel"]
      })
      .then(({response}) => {
        if (response === 0) {
          onClose()
          try {
            dispatch(removeWorkspace(workspace))
          } catch (e) {
            dispatch(Notice.set(ErrorFactory.create(e)))
          }
        }
      })
  }

  return (
    <StyledContent>
      <StyledWorkspaceDetail>
        <Title>{name}</Title>
        <Status>
          <StatusLight status={wsStatus} />
          <p>{wsStatus || "unknown"}</p>
        </Status>
        <WorkspaceFields>
          <Field label="Host" value={[host, port].join(":")} />
          <Field label="ZQD Version" value={version} />
          <Field label="Spaces" value={`${spaceCount}`} />
        </WorkspaceFields>
      </StyledWorkspaceDetail>
      <StyledFooter>
        <ToolbarButton text="OK" onClick={onClose} />
        <ToolbarButton text="Edit" onClick={onEdit} />
        {!isDefault && <Link onClick={onRemove}>Remove</Link>}
      </StyledFooter>
    </StyledContent>
  )
}

const ViewWorkspaceModal = ({onClose}) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <EditWorkspaceModal onClose={() => setEditing(false)} />
  } else {
    return <ViewWorkspace onClose={onClose} onEdit={() => setEditing(true)} />
  }
}

export default ViewWorkspaceModal
