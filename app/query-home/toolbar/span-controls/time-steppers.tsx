import React from "react"

import Animate from "src/js/components/Animate"
import CarrotDown from "src/js/components/icons/carrot-down.svg"
import CarrotUp from "src/js/components/icons/carrot-up.svg"

type Props = {
  show: boolean
  onUp: Function
  onDown: Function
  style: Object
}

const TimeSteppers = ({show, onUp, onDown, style}: Props) => {
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

export default TimeSteppers
