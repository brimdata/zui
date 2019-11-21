/* @flow */
import {isEqual} from "lodash"
import React, {useState} from "react"
import classNames from "classnames"

import type {TimeArg} from "../../state/search/types"
import {isString} from "../../lib/is"
import Animate from "../Animate"
import MenuBarButton from "../MenuBarButton"
import TimeInput from "./TimeInput"
import TimePiece from "./TimePiece"
import TimeSteppers from "./TimeSteppers"
import brim, {type Ts} from "../../brim"
import useFuzzyHover from "../../hooks/useFuzzyHover"

type Props = {
  timeArg: TimeArg,
  prevTimeArg: ?TimeArg,
  onChange: Function
}

export default function TimeButton({timeArg, prevTimeArg, onChange}: Props) {
  let [[x, y], setPosition] = useState([0, 0])
  let [unit, setUnit] = useState("month")
  let [editing, setEditing] = useState(false)
  let fuzzy = useFuzzyHover(0, 150)
  let dirty = !!prevTimeArg && !isEqual(timeArg, prevTimeArg)

  function updatePosition(e) {
    fuzzy.mouseEnter()
    let {width, x, y} = e.currentTarget.getBoundingClientRect()
    let stepperWidth = 20
    let centeredX = x + width / 2 - stepperWidth / 2
    setUnit(e.currentTarget.dataset.unit)
    setPosition([centeredX, y])
  }

  function onUp(e) {
    e.stopPropagation()
    if (isString(timeArg)) return
    onChange(
      brim
        .time(timeArg)
        .add(1, unit)
        .toTs()
    )
  }

  function onDown(e) {
    e.stopPropagation()
    if (isString(timeArg)) return
    onChange(
      brim
        .time(timeArg)
        .subtract(1, unit)
        .toTs()
    )
  }

  function onClick() {
    setEditing(true)
    fuzzy.mouseLeave()
  }

  function onSubmit(date) {
    onChange(date)
    setEditing(false)
  }

  function reset(e) {
    e.stopPropagation()
    if (prevTimeArg) {
      onChange(prevTimeArg)
    }
  }

  if (editing) return <TimeInput timeArg={timeArg} onSubmit={onSubmit} />
  return (
    <div
      className={classNames("time-picker-button", {
        hovering: fuzzy.hovering
      })}
      onMouseLeave={fuzzy.mouseLeave}
      onClick={onClick}
    >
      <div className="hover-zone" />
      <TimeSteppers
        show={fuzzy.hovering}
        onUp={onUp}
        onDown={onDown}
        style={{transform: `translate(${x}px, ${y}px)`}}
      />
      <MenuBarButton>
        {isString(timeArg) ? (
          brim.relTime(timeArg).format()
        ) : (
          <TimeDisplay ts={timeArg} onMouseEnter={updatePosition} />
        )}
      </MenuBarButton>
      <ChangedDot show={dirty} onClick={reset} />
    </div>
  )
}

function ChangedDot({show, onClick}) {
  let enter = {scale: [0, 1]}
  return (
    <Animate show={show} enter={enter}>
      <div className="changed-dot" onClick={onClick} />
    </Animate>
  )
}

type TDProps = {ts: Ts, onMouseEnter: Function}
function TimeDisplay({ts, onMouseEnter}: TDProps) {
  let t = brim.time(ts)
  return (
    <>
      <TimePiece data-unit="month" onMouseEnter={onMouseEnter}>
        {t.format("MMM")}
      </TimePiece>
      <TimePiece data-unit="day" onMouseEnter={onMouseEnter}>
        {t.format("DD")}
      </TimePiece>
      ,
      <TimePiece data-unit="year" onMouseEnter={onMouseEnter}>
        {t.format("YYYY")}
      </TimePiece>
      <TimePiece data-unit="hour" onMouseEnter={onMouseEnter}>
        {t.format("HH")}
      </TimePiece>
      :
      <TimePiece data-unit="minute" onMouseEnter={onMouseEnter}>
        {t.format("mm")}
      </TimePiece>
    </>
  )
}
