import React from "react"
import {useImportOnDrop} from "app/features/import/use-import-on-drop"
import get from "lodash/get"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import AddPoolButton from "../AddPoolButton"
import SavedPoolsList from "../SavedPoolsList"
import {
  ClickRegion,
  DragAnchor,
  SectionContents,
  SectionHeader,
  StyledArrow,
  StyledSection,
  Title
} from "./common"
import {DropOverlay} from "./drop-overlay"

function PoolsSection({isOpen, style, resizeProps, toggleProps}) {
  const workspace = useSelector(Current.getWorkspace)
  const id = get(workspace, ["id"], "")
  const wsStatus = useSelector(WorkspaceStatuses.get(id))
  const pools = useSelector(Current.getPools)
  const [props, ref] = useImportOnDrop()
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
      <SectionContents ref={ref}>
        <SavedPoolsList pools={pools} workspaceStatus={wsStatus} />
        <DropOverlay show={props.canDrop && props.isOver}>
          Drop to import...
        </DropOverlay>
      </SectionContents>
    </StyledSection>
  )
}

export default PoolsSection
