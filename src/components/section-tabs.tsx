import React, {useLayoutEffect, useRef, useState} from "react"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;

  button {
    background: none;
    border: none;

    display: flex;
    align-items: center;

    border-radius: 6px;
    padding: 6px 6px;

    text-transform: uppercase;
    font-weight: 500;
    font-size: 11px;
    opacity: 0.5;

    &:hover:not([aria-pressed="true"]) {
      opacity: 0.7;
      transition: opacity 0.2s;
      background: rgba(0, 0, 0, 0.04);
    }

    &:active:not([aria-pressed="true"]) {
      opacity: 0.8;
      background: rgba(0, 0, 0, 0.08);
    }

    &[aria-pressed="true"] {
      opacity: 1;
    }

    span {
      padding: 0 2px;
      display: block;
    }
  }
`

const Underline = styled.div`
  height: 2px;
  background: var(--primary-color);
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 1px;
`

export type SectionTabOptions = {
  label: string
  value: string
}

export function SectionTabs(props: {
  value: string
  options: SectionTabOptions[]
  onChange: (value: string) => void
}) {
  const changeCount = useRef(0)
  function changeTo(value: string) {
    if (value === props.value) return
    props.onChange(value)
    changeCount.current += 1
  }

  const ref = useRef<HTMLDivElement>()
  const [pos, setPos] = useState({x: 0, width: 10})

  useLayoutEffect(() => {
    const el = ref.current
    if (el) {
      const parent = el.getBoundingClientRect()
      const pressed = el.querySelector(`[aria-pressed="true"] span`)
      if (pressed) {
        const button = pressed.getBoundingClientRect()
        const x = button.x - parent.x
        const width = button.width
        setPos({x, width})
      }
    }
  }, [props.value])

  return (
    <BG ref={ref}>
      {props.options.map((opts) => (
        <button
          key={opts.value}
          onClick={() => changeTo(opts.value)}
          aria-pressed={opts.value === props.value}
          data-section-tab-value={opts.value}
        >
          <span>{opts.label}</span>
        </button>
      ))}
      <Underline
        style={{
          transform: `translateX(${pos.x}px)`,
          width: pos.width,
          transition: changeCount.current === 0 ? "none" : "all 200ms",
        }}
      />
    </BG>
  )
}
