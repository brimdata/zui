import React, {useRef, useState, useLayoutEffect} from "react"
import styled from "styled-components"

const PADDING = 2

const BG = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  height: 22px;
  position: relative;
  padding: ${PADDING}px;

  button {
    border: transparent;
    background: none;
    height: 100%;
    white-space: nowrap;
    padding: 0 12px;
    min-width: min-content;
    border-radius: 4px;
    transition: background 50ms;

    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`

type SpotlightProps = {
  width: number
  x: number
  height: number
  animate: boolean
}

const Spotlight = styled.div<SpotlightProps>`
  z-index: -1;
  position: absolute;
  background: white;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  transform: translateX(${(p) => p.x}px);
  transition: ${(p) => (p.animate ? "all 500ms" : "none")};
  border-radius: 4px;
`

type Props = {
  options: string[]
}

export default function ViewToggle({options}: Props) {
  const ref = useRef()
  const first = useRef(true)
  const [selected, setSelected] = useState(0)
  const [spotlight, setSpotlight] = useState({x: 0, width: 0, height: 0})

  const moveSpotlight = (index, animate = true) => {
    const node = ref.current
    if (node) {
      const parent = node.getBoundingClientRect()
      const child = node
        .querySelectorAll("button")
        [index].getBoundingClientRect()

      setSpotlight({
        x: child.x - parent.x - PADDING,
        width: child.width,
        height: child.height,
        animate
      })
    }
  }

  useLayoutEffect(() => {
    if (first.current) {
      moveSpotlight(selected, false)
      first.current = false
    } else {
      moveSpotlight(selected)
    }
  }, [selected])

  return (
    <BG ref={ref}>
      <Spotlight {...spotlight} />
      {options.map((option, index) => (
        <button key={index} onClick={() => setSelected(index)}>
          {option}
        </button>
      ))}
    </BG>
  )
}
