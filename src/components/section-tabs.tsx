import React, {useLayoutEffect, useRef, useState} from "react"
import {MenuItem} from "src/core/menu"
import styled from "styled-components"
import {useResponsiveMenu} from "./button-menu"
import {MoreItemsButton} from "./more-items-button"

const BG = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  height: 100%;
  position: relative;
  overflow: hidden;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;

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
      background: var(--sidebar-item-hover);
    }

    &:active:not([aria-pressed="true"]) {
      opacity: 0.8;
      background: var(--sidebar-item-active);
      box-shadow: var(--sidebar-item-active-shadow);
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

export function SectionTabs(props: {options: MenuItem[]}) {
  const changeCount = useRef(0)
  const ref = useRef<HTMLDivElement>()
  const [pos, setPos] = useState({x: 0, width: 10})
  const pressedIndex = props.options.findIndex((opt) => opt.checked)

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
  }, [pressedIndex])

  const menu = useResponsiveMenu(ref, props.options)

  return (
    <BG>
      <Nav ref={ref}>
        {props.options.map((opts, i) => (
          <button
            key={opts.id ?? i}
            onClick={() => {
              changeCount.current += 1
              opts.click()
            }}
            aria-pressed={opts.checked}
            data-section-tab-value={opts.label.toLowerCase()}
            style={{
              visibility: menu.isHidden(i) ? "hidden" : "visible",
            }}
          >
            <span>{opts.label}</span>
          </button>
        ))}
      </Nav>
      <Underline
        style={{
          transform: `translateX(${pos.x}px)`,
          width: pos.width,
          transition:
            changeCount.current === 0 ? "none" : "width 200ms, transform 200ms",
          visibility: menu.isHidden(pressedIndex) ? "hidden" : "visible",
        }}
      />
      {menu.hasHiddenItems ? (
        <MoreItemsButton items={menu.hiddenItems} />
      ) : null}
    </BG>
  )
}
