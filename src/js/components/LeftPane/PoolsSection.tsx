import {useSelector} from "react-redux"
import Current from "../../state/Current"
import get from "lodash/get"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import Pools from "../../state/Pools"
import AddPoolButton from "../AddPoolButton"
import SavedPoolsList from "../SavedPoolsList"
import React from "react"
import {
  ClickRegion,
  DragAnchor,
  SectionContents,
  SectionHeader,
  StyledArrow,
  StyledSection,
  Title
} from "./common"

function PoolsSection({isOpen, style, resizeProps, toggleProps}) {
  const workspace = useSelector(Current.getWorkspace)
  const id = get(workspace, ["id"], "")
  const wsStatus = useSelector(WorkspaceStatuses.get(id))
  const pools = useSelector(Pools.getPools(id))

  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Pools</Title>
        </ClickRegion>
        <AddPoolButton />
      </SectionHeader>
      <SectionContents>
        <SavedPoolsList pools={pools} workspaceStatus={wsStatus} />
      </SectionContents>
    </StyledSection>
  )
}

export default PoolsSection
