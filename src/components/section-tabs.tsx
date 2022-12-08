import React from "react"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  align-items: center;
  padding: 0 6px;
  height: 100%;

  button {
    background: none;
    border: none;
    display: flex;

    border-radius: 5px;
    padding: 0 6px;
    text-transform: uppercase;

    span {
      height: 22px;
      display: flex;
      align-items: center;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding: 4px;
      font-size: 11px;
      opacity: 0.5;
    }

    &:hover {
      span {
        opacity: 0.7;
        transition: opacity 0.2s;
      }
    }

    &:active {
      span {
        opacity: 0.8;
      }
    }

    &[aria-pressed="true"] {
      span {
        opacity: 1;
        border-bottom: 2px solid var(--primary-color);
      }
    }
  }
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
  function changeTo(value: string) {
    if (value === props.value) return
    props.onChange(value)
  }

  return (
    <BG>
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
    </BG>
  )
}
