/* @flow */

import {isEmpty} from "lodash"
import {useDispatch} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import type {Finding} from "../../state/reducers/investigation"
import {Mono, Stats} from "../Typography"
import {
  changeSearchBarInput,
  deleteFindingByTs,
  setCurrentSpaceName,
  setInnerTimeWindow,
  setOuterTimeWindow,
  setSearchBarPins
} from "../../state/actions"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import {format} from "../../lib/Time"
import {humanDuration} from "../../lib/TimeWindow"
import {isNumber} from "../../lib/is"
import {withCommas} from "../../lib/fmt"
import Caret from "../../icons/caret-bottom-sm.svg"
import Log from "../../models/Log"
import VerticalTable from "../Tables/VerticalTable"
import X from "../../icons/x-md.svg"

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

  function timeFormat(date) {
    return format(date, "MMM DD, YYYY HH:mm:ss")
  }

  let descriptor = [
    {type: "string", name: "Executed:"},
    {type: "string", name: "Space:"},
    {type: "string", name: "Span:"}
  ]

  let tuple = [
    timeFormat(finding.ts),
    finding.search.space,
    finding.search.span.map(timeFormat).join(" – ")
  ]

  let log = new Log(tuple, descriptor)

  return (
    <div className="finding-card-wrapper">
      <div className={classNames("finding-card", {open})} onClick={onClick}>
        <FindingProgram search={finding.search} />
        <FindingFooter finding={finding} />
      </div>
      {open && (
        <div className="finding-detail">
          <VerticalTable descriptor={descriptor} log={log} light />
        </div>
      )}

      <Expand onClick={onExpandClick} open={open} />
      <Remove onClick={onRemove} />
    </div>
  )
})

function FindingProgram({search}) {
  if (isEmpty(search.pins) && isEmpty(search.program)) return <Mono>*</Mono>

  return (
    <div className="program">
      {search.pins.map((text, i) => (
        <Mono className="pin" key={i}>
          {text}
        </Mono>
      ))}
      <Mono>{search.program}</Mono>
    </div>
  )
}

function FindingFooter({finding}) {
  return (
    <div className="footer">
      {isNumber(finding.resultCount) ? (
        <Stats>Results: {withCommas(finding.resultCount)}</Stats>
      ) : (
        <Stats>...</Stats>
      )}
      <Stats>{humanDuration([finding.ts, new Date()])} ago</Stats>
    </div>
  )
}

function Expand({open, ...props}) {
  return (
    <div className={classNames("gutter-button expand", {open})} {...props}>
      <Caret />
    </div>
  )
}

function Remove(props) {
  return (
    <div className="gutter-button remove" {...props}>
      <X />
    </div>
  )
}
