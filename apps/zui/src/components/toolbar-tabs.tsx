import React, {useLayoutEffect, useRef, useState} from "react"
import {MenuItem} from "src/core/menu"
import styles from "./toolbar-tabs.module.css"
import Icon from "src/app/core/icon-temp"

export function ToolbarTabs(props: {onlyIcon: boolean; options: MenuItem[]}) {
  const changeCount = useRef(0)
  const ref = useRef<HTMLDivElement>()
  const [pos, setPos] = useState({x: 0, width: 10})
  const pressedIndex = props.options.findIndex((opt) => opt.checked)

  function run() {
    const el = ref.current
    if (el) {
      const parent = el.getBoundingClientRect()
      const pressed = el.querySelector(`[aria-pressed="true"]`)
      if (pressed) {
        const button = pressed.getBoundingClientRect()
        const x = button.x - parent.x
        const width = button.width
        setPos({x, width})
      }
    }
  }

  useLayoutEffect(run, [pressedIndex, props.onlyIcon])

  return (
    <div className={styles.tabs}>
      <nav className={styles.nav} ref={ref}>
        {props.options.map((opts, i) => (
          <button
            className={styles.button}
            key={opts.id ?? i}
            onClick={() => {
              changeCount.current += 1
              opts.click()
            }}
            aria-pressed={opts.checked}
            data-section-tab-value={opts.label.toLowerCase()}
          >
            <Icon name={opts.iconName} size={14} />
            {!props.onlyIcon && <span>{opts.label}</span>}
          </button>
        ))}
      </nav>
      <div
        className={styles.selection}
        style={{
          transform: `translateX(${pos.x}px)`,
          width: pos.width,
          transition:
            changeCount.current === 0 ? "none" : "width 200ms, transform 200ms",
          visibility: "visible",
        }}
      />
    </div>
  )
}
