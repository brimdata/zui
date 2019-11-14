/* @flow */
import React, {useState} from "react"
import classNames from "classnames"

import {add, format, subtract} from "../lib/Time"
import Animate from "./Animate"
import CarrotDown from "../icons/carrot-down.svg"
import CarrotUp from "../icons/carrot-up.svg"
import MenuBarButton from "./MenuBarButton"
import TimePickerButtonInput from "./TimePickerButtonInput"
import useFuzzyHover from "../hooks/useFuzzyHover"

type Props = {
  date: Date,
  onChange: Function
}

export default function TimePickerButton({date, onChange}: Props) {
  let [[x, y], setPosition] = useState([0, 0])
  let [unit, setUnit] = useState("month")
  let [editing, setEditing] = useState(false)
  let fuzzy = useFuzzyHover(0, 150)

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
    onChange(add(date, 1, unit))
  }

  function onDown(e) {
    e.stopPropagation()
    onChange(subtract(date, 1, unit))
  }

  function onClick() {
    setEditing(true)
    fuzzy.mouseLeave()
  }

  function onSubmit(date) {
    onChange(date)
    setEditing(false)
  }

  if (editing) return <TimePickerButtonInput date={date} onSubmit={onSubmit} />

  return (
    <div
      className={classNames("time-picker-button", {hovering: fuzzy.hovering})}
      onMouseLeave={fuzzy.mouseLeave}
      onClick={onClick}
    >
      <div className="hover-zone" />
      <Steppers
        show={fuzzy.hovering}
        onUp={onUp}
        onDown={onDown}
        style={{transform: `translate(${x}px, ${y}px)`}}
      />
      <MenuBarButton>
        <TimePiece data-unit="month" onMouseEnter={updatePosition}>
          {format(date, "MMM")}
        </TimePiece>
        <TimePiece data-unit="day" onMouseEnter={updatePosition}>
          {format(date, "DD")}
        </TimePiece>
        ,
        <TimePiece data-unit="year" onMouseEnter={updatePosition}>
          {format(date, "YYYY")}
        </TimePiece>
        <TimePiece data-unit="hour" onMouseEnter={updatePosition}>
          {format(date, "HH")}
        </TimePiece>
        :
        <TimePiece data-unit="minute" onMouseEnter={updatePosition}>
          {format(date, "mm")}
        </TimePiece>
      </MenuBarButton>
    </div>
  )
}

function TimePiece({children, ...rest}) {
  return (
    <div className="time-piece" {...rest}>
      <div className="hover-zone" />
      {children}
    </div>
  )
}

function Steppers({show, onUp, onDown, style}) {
  const enter = (anime, el) =>
    anime
      .timeline({
        easing: "easeOutExpo",
        duration: 400
      })
      .add({
        targets: el.querySelector(".step-up"),
        translateY: [0, "-100%"],
        opacity: 1
      })
      .add(
        {
          targets: el.querySelector(".step-down"),
          translateY: [0, "100%"],
          opacity: 1
        },
        75
      )
      .add(
        {
          targets: el.querySelector(".step-up svg"),
          opacity: [0, 1]
        },
        200
      )
      .add(
        {
          targets: el.querySelector(".step-down svg"),
          opacity: [0, 1]
        },
        200 + 75
      )

  const exit = (anime, el) =>
    anime
      .timeline({duration: 100, easing: "linear"})
      .add({
        targets: el.querySelector(".step-down"),
        opacity: 0
      })
      .add(
        {
          targets: el.querySelector(".step-up"),
          opacity: 0
        },
        0
      )

  return (
    <Animate show={show} enter={enter} exit={exit}>
      <div className="steppers" style={style}>
        <StepUp onClick={onUp} />
        <StepDown onClick={onDown} />
      </div>
    </Animate>
  )
}

function StepUp(props) {
  return (
    <div className="stepper step-up" {...props}>
      <CarrotUp />
    </div>
  )
}

function StepDown(props) {
  return (
    <div className="stepper step-down" {...props}>
      <CarrotDown />
    </div>
  )
}
