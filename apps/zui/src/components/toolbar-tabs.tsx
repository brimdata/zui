import React, {useLayoutEffect, useRef, useState} from "react"
import {MenuItem} from "src/core/menu"
import styles from "./toolbar-tabs.module.css"
import {Icon} from "src/components/icon"
import {call} from "src/util/call"

export function ToolbarTabs(props: {
  onlyIcon?: boolean
  labelClassName?: string
  options: MenuItem[]
}) {
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
            data-tooltip={props.onlyIcon ? opts.label : null}
            className={styles.button}
            key={opts.id ?? i}
            onClick={() => {
              changeCount.current += 1
              call(opts.click)
            }}
            aria-pressed={opts.checked}
            data-section-tab-value={opts.label.toLowerCase()}
            disabled={opts.enabled === false}
          >
            {opts.iconName && <Icon name={opts.iconName} size="14px" />}
            {!props.onlyIcon && (
              <span className={props.labelClassName}>{opts.label}</span>
            )}
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
