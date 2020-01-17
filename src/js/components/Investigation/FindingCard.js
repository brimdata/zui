/* @flow */

import {useDispatch} from "react-redux"
import React from "react"
import classNames from "classnames"

import type {Finding} from "../../state/Investigation/types"
import {RemoveButton} from "../Buttons"
import {
  changeSearchBarInput,
  setCurrentSpaceName,
  setSearchBarPins
} from "../../state/actions"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import search from "../../state/Search"
import submitSearch from "../../flows/submitSearch"

type Props = {finding: Finding}

export default React.memo<Props>(function FindingCard({finding}: Props) {
  let dispatch = useDispatch()

  function onClick() {
    dispatch(setSearchBarPins(finding.search.pins))
    dispatch(changeSearchBarInput(finding.search.program))
    dispatch(setCurrentSpaceName(finding.search.space))
    dispatch(search.setSpanArgs(finding.search.spanArgs))
    dispatch(search.setSpanFocus(null))
    dispatch(submitSearch(false))
  }

  function onRemove() {
    dispatch(Investigation.deleteFindingByTs(finding.ts))
  }

  return (
    <div className={classNames("finding-card-wrapper")}>
      <div className="finding-card" onClick={onClick}>
        <FindingProgram search={finding.search} />
      </div>
      <RemoveButton className="gutter-button-style" onClick={onRemove} />
    </div>
  )
})
