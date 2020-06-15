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

type Props = {finding: Finding}

export default React.memo<Props>(function FindingCard({finding}: Props) {
  const dispatch = useDispatch()
  const clusterId = useSelector(Tab.clusterId)
  const spaceIds = useSelector(Spaces.ids(clusterId))

  function onClick() {
    dispatch(SearchBar.setSearchBarPins(finding.search.pins))
    dispatch(SearchBar.changeSearchBarInput(finding.search.program))
    dispatch(Search.setSpace(finding.search.spaceId))
    dispatch(Search.setSpanArgs(finding.search.spanArgs))
    dispatch(Search.setSpanFocus(null))
    dispatch(submitSearch(false))
  }

  function onRemove() {
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

  return (
    <div className={classNames("finding-card-wrapper")}>
      <div className="finding-card" onClick={onClick}>
        <FindingProgram search={finding.search} />
        {renderWarning()}
      </div>
      <RemoveButton className="gutter-button-style" onClick={onRemove} />
    </div>
  )
})
