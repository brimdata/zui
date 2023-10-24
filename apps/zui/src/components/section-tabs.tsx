import React, {useLayoutEffect, useRef, useState} from "react"
import {MenuItem} from "src/core/menu"
import styled from "styled-components"
import {MoreItemsButton} from "./more-items-button"
import {useResponsiveMenu} from "src/js/components/hooks/use-responsive-menu"

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
  const [pos, setPos] = useState({x: 0, width: 10})
  const pressedIndex = props.options.findIndex((opt) => opt.checked)
  const menu = useResponsiveMenu(props.options)

  useLayoutEffect(() => {
    const el = menu.containerRef.current
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
  }, [pressedIndex, menu])

  return (
    <BG ref={menu.containerRef}>
      <Nav>
        {menu.items.map((item, index) => (
          <button
            key={item.id ?? index}
            onClick={() => {
              changeCount.current += 1
              item.click()
            }}
            aria-pressed={item.checked}
            data-section-tab-value={item.label.toLowerCase()}
            style={{
              display: menu.isHidden(item) ? "none" : "block",
            }}
          >
            <span>{item.label}</span>
          </button>
        ))}

        {menu.hasHiddenItems ? (
          <MoreItemsButton items={menu.hiddenItems} ref={menu.moreRef} />
        ) : null}
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
    </BG>
  )
}
