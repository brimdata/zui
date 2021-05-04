import React, {useState} from "react"
import Tooltip from "src/js/components/Tooltip"
import styled from "styled-components"

const BG = styled.div`
  overflow: hidden;
`

const getTooltipStyle = (el: Element) => {
  if (!el) return {}
  const {top, left} = el.getBoundingClientRect()
  return {top: top - 21, left: left + 4}
}

export default function Cell({width, children, name}) {
  const [hover, setHover] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})

  function handleMouseEnter(e) {
    setHover(true)
    setTooltipStyle(getTooltipStyle(e.currentTarget))
  }

  function handleMouseLeave() {
    setHover(false)
  }

  return (
    <BG
      style={{width}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="field-cell"
    >
      {children}
      {hover && (
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      )}
    </BG>
  )
}
