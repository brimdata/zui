import React, {useLayoutEffect, useRef, useState} from "react"
import {MenuItem} from "src/core/menu"
import {MoreItemsButton} from "./more-items-button"
import {useResponsiveMenu} from "src/js/components/hooks/use-responsive-menu"

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
    <div ref={menu.containerRef} className="flex items-center h-full relative">
      <nav className="flex">
        {menu.items.map((item, index) => (
          <button
            className="section-tab-button"
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
      </nav>
      <div
        className="section-tab-button-underline"
        style={{
          transform: `translateX(${pos.x}px)`,
          width: pos.width,
          transition:
            changeCount.current === 0 ? "none" : "width 200ms, transform 200ms",
          visibility: menu.isHidden(pressedIndex) ? "hidden" : "visible",
        }}
      />
    </div>
  )
}
