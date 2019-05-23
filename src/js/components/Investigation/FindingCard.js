/* @flow */

import {useDispatch} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {ExpandButton, RemoveButton} from "../Buttons"
import type {Finding} from "../../state/reducers/investigation"
import {
  changeSearchBarInput,
  deleteFindingByTs,
  setCurrentSpaceName,
  setInnerTimeWindow,
  setOuterTimeWindow,
  setSearchBarPins
} from "../../state/actions"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import FindingDetail from "./FindingDetail"
import FindingFooter from "./FindingFooter"
import FindingProgram from "./FindingProgram"

type Props = {finding: Finding}

export default React.memo<Props>(function FindingCard({finding}: Props) {
  let dispatch = useDispatch()
  let [open, setOpen] = useState(false)

  function onClick() {
    dispatch(setSearchBarPins(finding.search.pins))
    dispatch(changeSearchBarInput(finding.search.program))
    dispatch(setCurrentSpaceName(finding.search.space))
    dispatch(setOuterTimeWindow(finding.search.span))
    dispatch(setInnerTimeWindow(null))
    dispatch(fetchMainSearch({saveToHistory: false}))
  }

  function onRemove() {
    dispatch(deleteFindingByTs(finding.ts))
  }

  function onExpandClick() {
    setOpen(!open)
  }

  return (
    <div className={classNames("finding-card-wrapper", {open})}>
      <div className="finding-card" onClick={onClick}>
        <FindingProgram search={finding.search} />
        <FindingFooter finding={finding} />
      </div>
      {open && <FindingDetail finding={finding} />}

      <ExpandButton
        className="gutter-button-style"
        onClick={onExpandClick}
        open={open}
      />
      <RemoveButton className="gutter-button-style" onClick={onRemove} />
    </div>
  )
})
