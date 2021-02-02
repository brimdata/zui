import React from "react"

import styled from "styled-components"
import {useDispatch, useSelector} from "react-redux"
import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import {BrimWorkspace} from "../brim"
import workspace from "../brim/workspace"
import DataStoreIcon from "../icons/DataStoreIcon"
import {activateWorkspace} from "../flows/workspace/activateWorkspace"

const StyledWorkspace = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px;
  border-radius: 3px;
  min-width: 250px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const WorkspaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin: 0 12px;
`
const WorkspaceName = styled.div`
  ${(p) => p.theme.typography.labelBold};
  color: var(--aqua);
  cursor: default;
`
const WorkspaceAddress = styled.div`
  ${(p) => p.theme.typography.labelSmall};
  color: var(--slate);
  cursor: default;
`

type Props = {
  workspace: BrimWorkspace
  onClick: () => void
}

const Workspace = ({workspace, onClick}: Props) => {
  return (
    <StyledWorkspace onClick={onClick}>
      <DataStoreIcon />
      <WorkspaceInfo>
        <WorkspaceName>{workspace.name}</WorkspaceName>
        <WorkspaceAddress>{workspace.getAddress()}</WorkspaceAddress>
      </WorkspaceInfo>
    </StyledWorkspace>
  )
}

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: scroll;
`

const StyledHeader = styled.h1`
  margin: 96px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const WorkspacesWrapper = styled.ul`
  padding: 0;
`

const WorkspaceChooserPage = () => {
  const dispatch = useDispatch()
  const workspaces = useSelector(Workspaces.all)

  return (
    <PageWrap>
      <StyledHeader>Choose a Workspace</StyledHeader>
      <WorkspacesWrapper>
        {workspaces.map((w) => (
          <Workspace
            key={w.id}
            workspace={workspace(w)}
            onClick={() => dispatch(activateWorkspace(w.id))}
          />
        ))}
      </WorkspacesWrapper>
    </PageWrap>
  )
}

export default WorkspaceChooserPage
