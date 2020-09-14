import {useDispatch} from "react-redux"
import React from "react"
import classNames from "classnames"
import get from "lodash/get"
import styled from "styled-components"

import {Finding} from "../../state/Investigation/types"
import {globalDispatch} from "../../state/GlobalContext"
import {submitSearch} from "../../flows/submitSearch/mod"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import Search from "../../state/Search"
import usePopupMenu from "../hooks/usePopupMenu"

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
    fill: ${(props) => props.theme.colors.lead};
    min-width: 13px;
    width: 13px;
    min-height: 13px;
    height: 13px;
  }
`

type Props = {finding: Finding; connId: string; spaceId: string}

export default React.memo<Props>(function FindingCard({
  finding,
  connId,
  spaceId
}: Props) {
  const dispatch = useDispatch()
  const findingSpaceName = get(finding, ["search", "spaceName"], "")

  function onClick() {
    dispatch(Search.restore(finding.search))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const menu = usePopupMenu([
    {
      label: "Delete",
      click: () =>
        globalDispatch(
          Investigation.deleteFindingByTs(connId, spaceId, finding.ts)
        )
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        globalDispatch(Investigation.clearSpaceInvestigation(connId, spaceId))
    }
  ])

  return (
    <div
      className={classNames("finding-card-wrapper")}
      onClick={onClick}
      onContextMenu={() => menu.open()}
      title={findingSpaceName}
    >
      <div className="finding-card">
        <StyledMagnifyingGlass />
        <FindingProgram search={finding.search} />
      </div>
    </div>
  )
})
