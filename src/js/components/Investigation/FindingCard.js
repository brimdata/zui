/* @flow */

import {includes} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import ReactTooltip from "react-tooltip"
import classNames from "classnames"
import get from "lodash/get"

import type {Finding} from "../../state/Investigation/types"
import {RemoveButton} from "../Buttons"
import {globalDispatch} from "../../state/GlobalContext"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import Spaces from "../../state/Spaces/selectors"
import Tab from "../../state/Tab"
import Warning from "../icons/warning-sm.svg"
import submitSearch from "../../flows/submitSearch"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import styled from "styled-components"
import usePopupMenu from "../hooks/usePopupMenu"

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
    fill: ${(props) => props.theme.colors.lead};
    min-width: 13px;
    width: 13px;
    min-height: 13px;
    height: 13px;
  }
`

type Props = {finding: Finding}

export default React.memo<Props>(function FindingCard({finding}: Props) {
  const dispatch = useDispatch()
  const clusterId = useSelector(Tab.clusterId)
  const spaceIds = useSelector(Spaces.ids(clusterId))
  const findingSpaceName = get(finding, ["search", "spaceName"], "")

  function onClick() {
    dispatch(SearchBar.setSearchBarPins(finding.search.pins))
    dispatch(SearchBar.changeSearchBarInput(finding.search.program))
    dispatch(Search.setSpace(finding.search.spaceId))
    dispatch(Search.setSpanArgs(finding.search.spanArgs))
    dispatch(Search.setSpanFocus(null))
    dispatch(submitSearch({history: false, investigation: false}))
  }

  function onRemove(e) {
    e.stopPropagation()
    globalDispatch(Investigation.deleteFindingByTs(finding.ts))
  }

  function renderWarning() {
    const findingSpaceId = get(finding, ["search", "spaceId"], "")
    const tip = "This space no longer exists"

    if (includes(spaceIds, findingSpaceId)) return null

    return (
      <div
        className="warning-body"
        data-tip={tip}
        data-effect="solid"
        data-place="right"
      >
        <Warning />
        <ReactTooltip />
      </div>
    )
  }

  const template = [
    {
      label: "Clear History",
      click: () => globalDispatch(Investigation.clearInvestigation())
    }
  ]

  const openMenu = usePopupMenu(template)
  const onContextMenu = () => {
    openMenu()
  }

  return (
    <div
      className={classNames("finding-card-wrapper")}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={findingSpaceName}
    >
      <div className="finding-card">
        <StyledMagnifyingGlass />
        <FindingProgram search={finding.search} />
        {renderWarning()}
      </div>
      <RemoveButton className="gutter-button-style" onClick={onRemove} />
    </div>
  )
})
