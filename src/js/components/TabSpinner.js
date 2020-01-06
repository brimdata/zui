/* @flow */
import React, {useEffect, useRef} from "react"
import anime from "animejs"

export default function TabSpinner() {
  let svgRef = useRef()

  useEffect(() => {
    let svg = svgRef.current
    if (!svg) return

    let el = svg.querySelector("circle")
    let total = el.getTotalLength()
    let threeQuarters = total * 0.25
    let rotation = 0

    const beginning = (el) => anime.setDashoffset(el) - 3
    const nextRotation = () => rotation + 252

    function tick() {
      return anime
        .timeline({
          targets: el,
          easing: "easeOutSine"
        })
        .add({
          duration: 500,
          endDelay: 100,
          strokeDashoffset: [beginning, threeQuarters]
        })
        .add({
          duration: 500,
          endDelay: 100,
          rotateZ: () => [rotation + "deg", nextRotation() + "deg"],
          strokeDashoffset: [threeQuarters, beginning]
        })
        .finished.then(() => {
          rotation = nextRotation() % 360
          tick()
        })
    }
    tick()

    return () => anime.remove(el)
  }, [svgRef.current])

  return (
    // $FlowFixMe Not sure why it doesn't like the svg ref
    <svg className="tab-spinner" viewBox="0 0 20 20" ref={svgRef}>
      <circle r="8" cx="10" cy="10" />
    </svg>
  )
}
