/* @flow */

import {isEmpty} from "lodash"
import {useDispatch} from "react-redux"
import React from "react"
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
import {humanDuration} from "../../lib/TimeWindow"
import Caret from "../../icons/caret-bottom-sm.svg"
import X from "../../icons/x-md.svg"

type Props = {finding: Finding}

export default function FindingCard({finding}: Props) {
  let dispatch = useDispatch()

  function onClick() {
    dispatch(setSearchBarPins(finding.search.pins))
    dispatch(changeSearchBarInput(finding.search.program))
    dispatch(setCurrentSpaceName(finding.search.space))
    dispatch(setOuterTimeWindow(finding.search.span))
    dispatch(setInnerTimeWindow(null))
    setTimeout(() => dispatch(fetchMainSearch({saveToHistory: false})), 150)
  }

  function onRemove() {
    dispatch(deleteFindingByTs(finding.ts))
  }

  let className = classNames("finding-card")

  return (
    <div className="finding-card-wrapper">
      <div className="left-gutter">
        <Expand />
      </div>
      <div className={className} onClick={onClick}>
        <FindingProgram search={finding.search} />
        <FindingFooter finding={finding} />
      </div>
      <div className="right-gutter">
        <Remove onClick={onRemove} />
      </div>
    </div>
  )
}

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
      <Stats>{humanDuration([finding.ts, new Date()])} ago</Stats>
    </div>
  )
}

function Expand() {
  return (
    <div className="gutter-button expand">
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
